import { createPaymentIntent } from '@/use-cases/payments/createPaymentIntent.usecase';
import { handleStripeWebhook } from '@/use-cases/payments/handleStripeWebhook.usecase';
import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';
import { PaymentModel } from '@domain/models/payment.model';

jest.mock('@domain/models/payment.model');

describe('Payments unit tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, STRIPE_WEBHOOK_SECRET: 'whsec_test' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('createPaymentIntent usecase delegates to provider', async () => {
    const api = {
      createIntent: jest.fn().mockResolvedValue({
        id: 'pi_123',
        amount: 5000,
        currency: 'MXN',
        clientSecret: 'secret_123',
      }),
    } as any;

    const result = await createPaymentIntent(api, {
      amount: 50,
      currency: 'MXN',
    });

    expect(result.id).toBe('pi_123');
    expect(api.createIntent).toHaveBeenCalled();
  });

  test('handleStripeWebhook returns constructed event', async () => {
    const api = {
      constructEvent: jest
        .fn()
        .mockResolvedValue({ type: 'payment_intent.succeeded' }),
    } as any;

    const event = await handleStripeWebhook(api, {
      payload: Buffer.from('payload'),
      sig: 'sig',
      secret: 'secret',
    });

    expect(event.type).toBe('payment_intent.succeeded');
    expect(api.constructEvent).toHaveBeenCalled();
  });

  test('createPending - calls PaymentModel.create with pending status', async () => {
    const mockPaymentData = {
      orderId: 'pi_unit_1',
      amount: 100,
      currency: 'MXN',
      clientSecret: 'secret_123',
    };

    (PaymentModel.create as jest.Mock).mockResolvedValue(mockPaymentData);

    await PaymentDataAccess.createPending(mockPaymentData as any);

    expect(PaymentModel.create).toHaveBeenCalledWith({
      ...mockPaymentData,
      clientSecret: mockPaymentData.clientSecret ?? 'unknown',
      status: 'pending',
    });
  });

  test('markAsSucceeded returns updated when modified', async () => {
    (PaymentModel.updateOne as jest.Mock).mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });

    const result = await PaymentDataAccess.markAsSucceeded('pi_unit_1');

    expect(result).toBe('updated');
    expect(PaymentModel.updateOne).toHaveBeenCalledWith(
      { orderId: 'pi_unit_1' },
      { status: 'succeeded' },
    );
  });

  test('markAsSucceeded returns not_found when none matched', async () => {
    (PaymentModel.updateOne as jest.Mock).mockResolvedValue({
      matchedCount: 0,
      modifiedCount: 0,
    });

    const result = await PaymentDataAccess.markAsSucceeded('invalid_id');
    expect(result).toBe('not_found');
  });
});
