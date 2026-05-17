/**
 * Integration test for SPEI bank transfer payment intent creation.
 * Mocks StripeProvider to return SPEI bank transfer details and ensures DB record and email call.
 */

jest.mock('@infrastructure/api/stripeProvider.api', () => ({
  StripeProvider: {
    createIntent: jest.fn(),
    constructEvent: jest.fn(),
  },
}));

jest.mock('@/use-cases/emails/sendPaymentEmail.usecase', () => ({
  sendPaymentEmail: jest.fn(),
}));

import app from '@/index';
import request from 'supertest';
import { mongoDB, clearDatabase, closeDatabase } from '@db/mongoDB/mongoDB';
import { PaymentModel } from '@domain/models/payment.model';

const { StripeProvider } = require('@infrastructure/api/stripeProvider.api');
const {
  sendPaymentEmail,
} = require('@/use-cases/emails/sendPaymentEmail.usecase');

describe('SPEI payment integration', () => {
  const originalEnv = process.env;

  beforeAll(async () => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, STRIPE_WEBHOOK_SECRET: 'whsec_test' };
    await mongoDB('test');
  });

  afterAll(async () => {
    process.env = originalEnv;
    await clearDatabase();
    await closeDatabase();
  });

  test('POST /payments/payment-intent returns spei details and creates pending DB record', async () => {
    (StripeProvider.createIntent as jest.Mock).mockResolvedValue({
      id: 'pi_spei_1',
      amount: 10000,
      currency: 'MXN',
      clientSecret: null,
      speiDetails: {
        clabe: '012345678901234567',
        bankName: 'Banco Test',
        bankCode: '123',
        reference: 'REF12345',
        holderName: 'Test User',
        holderAddress: 'Av. Test 123',
      },
    });

    const payload = {
      amount: 100.0,
      currency: 'MXN',
      method: 'spei',
      name: 'Test User',
      email: 'test@example.com',
    };

    const res = await request(app)
      .post('/payments/payment-intent')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.result).toBeDefined();
    expect(res.body.result.speiDetails).toBeDefined();
    expect(res.body.result.speiDetails.clabe).toBe('012345678901234567');

    const dbPayment = await PaymentModel.findOne({ orderId: 'pi_spei_1' });
    expect(dbPayment).toBeDefined();
    expect(dbPayment?.status).toBe('pending');

    expect(sendPaymentEmail).toHaveBeenCalled();
  });
});
