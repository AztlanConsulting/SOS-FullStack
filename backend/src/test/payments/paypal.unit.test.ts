import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';
import { PaymentModel } from '@domain/models/payment.model';

jest.mock('@domain/models/payment.model');

describe('PaymentDataAccess unit-test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
