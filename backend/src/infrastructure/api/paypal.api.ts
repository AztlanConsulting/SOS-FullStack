import type {
  PaymentIntentDTO,
  PaymentIntentResult,
} from '@/domain/ports/paymentProvider.port';
import type {
  PaymentOrderId,
  PaymentSuccess,
  PaypalApi,
} from '@domain/ports/paypal.port';
import 'crypto';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import type Stripe from 'stripe';
dotenv.config();

const ENVIROMENT = process.env.ENVIROMENT;
const CLIENT_ID = process.env.PAYPAL_CLIENT;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

const ENDPOINT_URL =
  ENVIROMENT === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const PaypalProvider: PaypalApi = {
  // This value could be cached to optimize response, and lower api interactions
  async getAccessToken() {
    const auth = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const data = 'grant_type=client_credentials';
    const { accessToken, error } = await fetch(
      ENDPOINT_URL + '/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
        },
        body: data,
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => ({ accessToken: json.access_token, error: null }))
      .catch((error: string) => {
        console.error("Error generating paypal's access token: ", error);
        return { accessToken: null, error };
      });

    return { accessToken, error };
  },

  async createIntent(data: PaymentIntentDTO): Promise<PaymentIntentResult> {
    const { accessToken, error } = await PaypalProvider.getAccessToken();

    if (error !== null) {
      throw error;
    }

    let orderDataJson = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: data.product?.productName,
              description: data.product?.productId,
              quantity: '1',
              unit_amount: {
                currency_code: data.currency,
                value: data.amount,
              },
            },
          ],
          amount: {
            currency_code: data.currency,
            value: data.amount,
            breakdown: {
              item_total: {
                currency_code: data.currency,
                value: data.amount,
              },
            },
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

    let orderData = JSON.stringify(orderDataJson);

    const paymentId: PaymentOrderId = await fetch(
      ENDPOINT_URL + '/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Paypal-Request-Id': randomUUID(),
        },
        body: orderData,
      },
    )
      .then((res) => res.json())
      .then((orderData) => {
        return {
          orderId: orderData.id,
          error: null,
        };
      })
      .catch((error: string) => {
        console.error(error);
        return { orderId: null, error };
      });

    if (Boolean(paymentId.error)) throw paymentId.error;

    const paymentResult = {
      id: paymentId.orderId!,
      amount: data.amount,
      currency: data.currency,
      clientSecret: '1234567',
    };

    return paymentResult; // Send to browser
  },

  async completeOrder(orderId: string) {
    const { accessToken, error } = await PaypalProvider.getAccessToken();

    if (error !== null) {
      return { error };
    }

    const url = ENDPOINT_URL + '/v2/checkout/orders/' + orderId + '/capture';
    const response: Promise<PaymentSuccess> = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
        return { error };
      });

    return response;
  },
  // To work with the interface: It would be better for stripe implementation to
  // inherit from a common one, but for now its not to cause issues
  constructEvent(): Promise<Stripe.Event> {
    throw Error(
      'Error: Called Stripe implementation to finish transaction from PaypalProvider',
    );
  },
};

export default PaypalProvider;
