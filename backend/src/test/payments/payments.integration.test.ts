/**
 * Integration tests for payment-intent and webhook endpoints.
 * Stripe provider is mocked to avoid network calls; tests assert DB state changes.
 */

jest.mock('@infrastructure/api/stripeProvider.api', () => ({
  StripeProvider: {
    createIntent: jest.fn(),
    constructEvent: jest.fn(),
  },
}));

import app from '@/index';
import request from 'supertest';
import mongoose from 'mongoose';
import { PaymentModel } from '@domain/models/payment.model';
import { PurchaseModel } from '@/domain/models/purchase.model';
import { mongoDB, clearDatabase, closeDatabase } from '@db/mongoDB/mongoDB';

const { StripeProvider } = require('@infrastructure/api/stripeProvider.api');

describe('Payments integration tests', () => {
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

  test('POST /payments/payment-intent creates intent and DB pending record', async () => {
    (StripeProvider.createIntent as jest.Mock).mockResolvedValue({
      id: 'pi_integ_1',
      amount: 5000,
      currency: 'MXN',
      clientSecret: 'cs_test',
    });

    const payload = { amount: 50.0, currency: 'MXN', method: 'card' };

    const res = await request(app)
      .post('/payments/payment-intent')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.result.id).toBe('pi_integ_1');

    const dbPayment = await PaymentModel.findOne({ orderId: 'pi_integ_1' });
    expect(dbPayment).toBeDefined();
    expect(dbPayment?.status).toBe('pending');
  });

  test('POST /payments/webhook processes webhook and updates payment status', async () => {
    const hookOrderId = 'pi_webhook_1';

    await PaymentModel.create({
      orderId: hookOrderId,
      amount: 100,
      currency: 'MXN',
      method: 'stripe',
      clientSecret: 'x',
      status: 'pending',
    });

    (StripeProvider.constructEvent as jest.Mock).mockResolvedValue({
      type: 'payment_intent.succeeded',
      data: { object: { id: hookOrderId } },
    });

    const raw = JSON.stringify({ id: hookOrderId });
    const rawBuffer = Buffer.from(raw);

    const res = await request(app)
      .post('/payments/webhook')
      .set('stripe-signature', 'sig_test')
      .set('Content-Type', 'application/json')
      .send(rawBuffer);

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);

    const updated = await PaymentModel.findOne({ orderId: hookOrderId });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe('succeeded');
  });

  test('POST /payments/webhook with invalid signature returns 400', async () => {
    const badRaw = JSON.stringify({ id: 'pi_invalid_sig' });

    (StripeProvider.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const res = await request(app)
      .post('/payments/webhook')
      .set('stripe-signature', 'bad_sig')
      .send(badRaw);

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/Webhook Error/i);
  });
});
