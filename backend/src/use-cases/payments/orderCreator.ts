import type { PaymentIntentDTO } from '@/domain/ports/paymentProvider.port';
import type { DetailOrder } from '@/domain/ports/paypal.port';

function createItems(data: PaymentIntentDTO) {
  return [
    {
      name: data.product?.productName ?? data.plan!.name,
      description:
        data.product?.productId ??
        `${data.plan!.duration} | ${data.plan!.radius}`,
      quantity: '1',
      unit_amount: {
        currency_code: data.currency,
        value: data.amount,
      },
    },
  ];
}

function breakdown(data: PaymentIntentDTO) {
  return {
    item_total: {
      currency_code: data.currency,
      value: data.amount,
    },
  };
}

// Creates paypal Order details and description of transaction
/**
 * Controller that receives payment and order detauls to build the transaction
 * @params data: PaymentDTO - product or plan details
 * @returns - Object - paypal expected payload
 */
function orderCreator(data: PaymentIntentDTO): DetailOrder {
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        items: createItems(data),
        amount: {
          currency_code: data.currency,
          value: data.amount,
          breakdown: breakdown(data),
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
          payment_method_selected: 'PAYPAL',
          brand_name: 'SOS - Encontrando mascotas',
          shipping_preference: 'NO_SHIPPING',
          locale: 'en-US',
          user_action: 'PAY_NOW',
          return_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/complete-payment`,
          cancel_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/cancel-payment`,
        },
      },
    },
  };
}

export default orderCreator;
