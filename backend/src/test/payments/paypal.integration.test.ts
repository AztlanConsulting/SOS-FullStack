import { PaymentModel } from '@/domain/models/payment.model';
import { PurchaseModel } from '@/domain/models/purchase.model';
import { WorkshopModel } from '@/domain/models/workshop.model';
import app from '@/index';
import { PaymentDataAccess } from '@/infrastructure/data-access/payment.data-access';
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

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    process.env = originalEnv;
    await clearDatabase();
    await closeDatabase();
  });

  describe('Step 1: Create Order', () => {
    it('should create a PayPal order and save a pending record in DB', async () => {
      // Create a real workshop in DB
      const workshop = await WorkshopModel.create({
        name: 'something',
        description: 'something',
        price: 50,
        content: [],
        category: ['something'],
        img: { data: Buffer.from('hola'), contentType: 'pdf' },
        imageUrl: 'http://example.com',
      });

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
          productId: String(workshop._id),
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
        method: 'paypal',
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
  });

  describe('ConfirmPaymentAmount middleware', () => {
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
          productId: 'unexisting_id',
          productName: 'Taller 123',
        },
      };

      // 2. Execute Request
      const response = await request(app)
        .post('/payments/create-order')
        .send(createPayload);

      // 3. Assertions
      expect(response.status).toBe(402);
    });

    it('calculate price of custom plans', async () => {
      // 1. Setup Mock Responses for PayPal API
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ access_token: 'mock_access_token' }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ id: 'PP-ORDER-67890' }),
        });

      const paymentSpy = jest.spyOn(PaymentDataAccess, 'createPending');

      const createPayload = {
        amount: 0.0,
        currency: 'MXN',
        method: 'paypal',
        customerId: new mongoose.Types.ObjectId().toString(),
        plan: {
          planName: 'Personalizado',
          planDetails: {
            days: 3,
            km: 14,
            selectedFeatures: [
              'Anuncio de 3 días en un área de 10km a la redonda',
              'Publicación en nuestras redes sociales',
              'Video y lista de consejos de búsqueda',
              'Cartel para imprimir',
            ],
            totalPrice: 0,
          },
        },
      };

      // 2. Execute Request
      const response = await request(app)
        .post('/payments/create-order')
        .send(createPayload);

      // 3. Assertions
      expect(response.status).toBe(201);
      expect(paymentSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 25.4,
          clientSecret: 'temp_client_secret',
          currency: 'MXN',
          method: 'paypal',
          orderId: 'PP-ORDER-67890',
        }),
      );
    });

    it('Forged amount', async () => {
      // Create a real workshop in DB
      const workshop = await WorkshopModel.create({
        name: 'something',
        description: 'something',
        price: 50,
        content: [],
        category: ['something'],
        img: { data: Buffer.from('hola'), contentType: 'pdf' },
        imageUrl: 'http://example.com',
      });

      // 1. Setup Mock Responses for PayPal API
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ access_token: 'mock_access_token' }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ id: 'PP-ORDER-67890' }),
        });

      const paymentSpy = jest.spyOn(PaymentDataAccess, 'createPending');

      const createPayload = {
        amount: 0.0,
        currency: 'MXN',
        method: 'paypal',
        customerId: new mongoose.Types.ObjectId().toString(),
        product: {
          productId: String(workshop._id),
          productName: 'Taller 123',
        },
      };

      // 2. Execute Request
      const response = await request(app)
        .post('/payments/create-order')
        .send(createPayload);

      // 3. Assertions
      expect(response.status).toBe(201);
      expect(paymentSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          clientSecret: 'temp_client_secret',
          currency: 'MXN',
          method: 'paypal',
          orderId: 'PP-ORDER-67890',
        }),
      );
    });
  });
});
