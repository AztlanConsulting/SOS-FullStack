import type { PaypalApi } from '@/domain/ports/paypal.port';
import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';
import { PaymentModel } from '@domain/models/payment.model';
import type { PaymentIntentDTO } from '@/domain/ports/paymentProvider.port';
import { PaymentIntentResult } from '@/domain/ports/paymentProvider.port';
import orderCreator from '@/use-cases/payments/orderCreator';

jest.mock('@domain/models/payment.model');

describe('PaymentDataAccess unit-test', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      PAYPAL_REDIRECT_BASE_URL: 'https://test.com',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('should correctly build a PayPal order when a PRODUCT is provided', () => {
    const productMock: PaymentIntentDTO = {
      amount: 50.0,
      currency: 'MXN',
      product: {
        productName: 'Manual 1',
        productId: '1234',
      },
    };

    const result = orderCreator(productMock);

    // Verify general structure
    expect(result.intent).toBe('CAPTURE');
    expect(result.purchase_units[0].amount.value).toBe(50.0);

    // Verify Item Mapping
    const item = result.purchase_units[0].items![0];
    expect(item.name).toBe('Manual 1');
    expect(item.description).toBe('1234');
    expect(item.unit_amount.value).toBe(50.0);

    // Verify Breakdown
    expect(result.purchase_units[0].amount.breakdown?.item_total.value).toBe(
      50.0,
    );
  });

  test('should correctly build a PayPal order when a PLAN is provided', () => {
    const planMock: PaymentIntentDTO = {
      amount: 15.0,
      currency: 'MXN',
      plan: {
        name: 'Premium Plan',
        species: 'Perro',
        date: '2025-03-27',
        breed: 'oighrjwpfdk',
        sex: 'Macho',
        color: 'ighwjfkd',
        size: 'Mini: 1 a 4 kg',
        description: '0hjgprowkfd',
        imageLayout: '1',
        address: 'Metropolitan Tabernacle, Calle Moneda, Mexico',
        location: {
          coords: [19.434063867321765, -99.13269035300812],
          displayName: 'Metropolitan Tabernacle, Calle Moneda, Mexico',
        },
        locationCoords: [19.434063867321765, -99.13269035300812],
        contactName: 'hgroipjskfd',
        phoneNumber: '+525555555555',
        email: 'q@q.com',
        planName: 'Personalizado',
        planDetails: {
          days: 23,
          km: 28,
          selectedFeatures: [
            'Anuncio de 23 días en un área de 28 km a la redonda',
            'Publicación en nuestras redes sociales',
            'Video y lista de consejos de búsqueda',
            'Cartel para imprimir',
            'Geolocalización doble',
            'Reel de Instagram y Facebook',
          ],
          totalPrice: 2170,
        },
      },
    };

    const result = orderCreator(planMock);

    const item = result.purchase_units[0].items![0];
    expect(item.name).toBe('Premium Plan');

    // Description should be: duration | radius
    expect(item.description).toBe('23 | 28');
    expect(item.unit_amount.currency_code).toBe('MXN');
  });

  test('create and capture orders usecases', () => {
    const productMock: PaymentIntentDTO = {
      amount: 50.0,
      currency: 'MXN',
      product: {
        productName: 'Manual 1',
        productId: '1234',
      },
    };

    const api: PaypalApi = {
      getAccessToken: jest
        .fn()
        .mockResolvedValue({ accessToken: '1234', error: new Error('Error') }),
      createOrder: jest.fn().mockResolvedValue({
        id: 'orderId',
        amount: productMock.amount,
        currency: productMock.currency,
        clientSecret: 'temp_client_secret',
      }),
      completeOrder: jest.fn().mockResolvedValue({ id: 'paymentSuccess' }),
    };
  });

  test('createPending - successfully creates a pending payment record', async () => {
    const mockPaymentData = {
      orderId: 'pi_123',
      amount: 100,
      currency: 'MXN',
      clientSecret: 'secret_123',
    };

    (PaymentModel.create as jest.Mock).mockResolvedValue(mockPaymentData);

    await PaymentDataAccess.createPending(mockPaymentData);

    expect(PaymentModel.create).toHaveBeenCalledWith({
      ...mockPaymentData,
      status: 'pending',
    });
  });

  test('markAsSucceeded - returns "updated" when document is modified', async () => {
    (PaymentModel.updateOne as jest.Mock).mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });

    const result = await PaymentDataAccess.markAsSucceeded('pi_123');

    expect(result).toBe('updated');
    expect(PaymentModel.updateOne).toHaveBeenCalledWith(
      { orderId: 'pi_123' },
      { status: 'succeeded' },
    );
  });

  test('markAsSucceeded - returns "not_found" when no document matches', async () => {
    (PaymentModel.updateOne as jest.Mock).mockResolvedValue({
      matchedCount: 0,
      modifiedCount: 0,
    });

    const result = await PaymentDataAccess.markAsSucceeded('invalid_id');
    expect(result).toBe('not_found');
  });
});
