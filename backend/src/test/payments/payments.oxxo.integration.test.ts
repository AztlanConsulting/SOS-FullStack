/**
 * Integration test for OXXO payment intent creation.
 * Mocks StripeProvider to return OXXO voucher details and ensures DB record and email call.
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

describe('OXXO payment integration', () => {
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

  test('POST /payments/payment-intent returns oxxo details and creates pending DB record', async () => {
    (StripeProvider.createIntent as jest.Mock).mockResolvedValue({
      id: 'pi_oxxo_1',
      amount: 2500,
      currency: 'MXN',
      clientSecret: null,
      oxxoDetails: {
        number: '1234567890',
        expiresAfter: '2026-05-20T00:00:00Z',
        voucherUrl: 'https://stripe.test/voucher.pdf',
      },
    });

    const payload = {
      amount: 25.0,
      currency: 'MXN',
      method: 'oxxo',
      name: 'Test User',
      email: 'test@example.com',
    };

    const res = await request(app)
      .post('/payments/payment-intent')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.result).toBeDefined();
    expect(res.body.result.oxxoDetails).toBeDefined();
    expect(res.body.result.oxxoDetails.number).toBe('1234567890');

    const dbPayment = await PaymentModel.findOne({ orderId: 'pi_oxxo_1' });
    expect(dbPayment).toBeDefined();
    expect(dbPayment?.status).toBe('pending');

    expect(sendPaymentEmail).toHaveBeenCalled();
  });
});
