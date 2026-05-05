import { PaymentModel } from '@/domain/models/payment.model';
import { PurchaseModel } from '@/domain/models/purchase.model';
import app from '@/index';
import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import mongoose from 'mongoose';
import request from 'supertest';

const mockFetch = jest.fn();
global.fetch = mockFetch;
/**
 * Integration tests for paypal.
 * Focuses on verifying that the repository correctly interacts with the Mongoose model
 * and handles various database response scenarios.
 */
describe('Paypal integration tests', () => {
  const originalEnv = process.env;

  beforeAll(async () => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      PAYPAL_REDIRECT_BASE_URL: 'https://test.com',
    };
    await mongoDB('test');
  });

  afterAll(async () => {
    process.env = originalEnv;
    await clearDatabase();
    await closeDatabase();
  });

  describe('Step 1: Create Order', () => {
    it('should create a PayPal order and save a pending record in DB', async () => {
      // 1. Setup Mock Responses for PayPal API
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ access_token: 'mock_access_token' }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ id: 'PP-ORDER-67890' }),
        });

      const createPayload = {
        amount: 50.0,
        currency: 'MXN',
        method: 'paypal',
        customerId: new mongoose.Types.ObjectId().toString(),
        product: {
          productId: 'work-123',
          productName: 'Taller 123',
        },
      };

      // 2. Execute Request
      const response = await request(app)
        .post('/payments/create-order')
        .send(createPayload);

      // 3. Assertions
      expect(response.status).toBe(201);
      expect(response.body.result.id).toBe('PP-ORDER-67890');

      // 4. Verify Database state
      const dbPayment = await PaymentModel.findOne({
        orderId: 'PP-ORDER-67890',
      });
      expect(dbPayment).toBeDefined();
      expect(dbPayment?.status).toBe('pending');
      expect(dbPayment?.amount).toBe(50.0);
    });
  });

  describe('STEP 2: Capture Order', () => {
    it('should capture the payment and create a purchase record', async () => {
      // 1. Pre-seed DB with a pending payment (as if Step 1 already happened)
      const mockOrderId = 'PP-ORDER-SUCCESS';
      await PaymentModel.create({
        orderId: mockOrderId,
        amount: 25.0,
        currency: 'MXN',
        clientSecret: 'temp_secret',
        status: 'pending',
      });

      // 2. Setup Mock Responses for Capture
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ access_token: 'mock_access_token' }),
        }) // getAccessToken
        .mockResolvedValueOnce({
          json: async () => ({ id: 'CAPTURE_ID_123', status: 'COMPLETED' }),
        }); // completeOrder

      const purchaseDetails = {
        userEmail: 'santiago@example.com',
        productId: 'workshop_abc',
        productType: 'workshop',
      };
      const planId = null;

      // 3. Execute Request
      const response = await request(app)
        .post(`/payments/capture-order/${mockOrderId}`)
        .send({ purchaseDetails, planId });

      // 4. Assertions
      expect(response.status).toBe(200);
      expect(response.text).toBe('CAPTURE_ID_123');

      // 5. Verify Payment was updated to 'succeeded'
      const updatedPayment = await PaymentModel.findOne({
        orderId: mockOrderId,
      });
      expect(updatedPayment?.status).toBe('succeeded');

      // 6. Verify Purchase was created
      const purchase = await PurchaseModel.findOne({
        userEmail: 'santiago@example.com',
      });
      expect(purchase).toBeDefined();
      expect(purchase?.paymentId).toBe('CAPTURE_ID_123');
      expect(purchase?.productId).toBe('workshop_abc');
    });

    it('should return 500 if the PayPal capture fails', async () => {
      const purchaseDetails = {
        userEmail: 'santiago@example.com',
        productId: 'workshop_abc',
        productType: 'workshop',
      };
      const planId = null;

      (global.fetch as jest.Mock).mockRejectedValue(
        new Error('PayPal API Down'),
      );

      const response = await request(app)
        .post('/payments/capture-order/FAIL_ID')
        .send({ purchaseDetails, planId });

      expect(response.status).toBe(500);
    });
  });
});
