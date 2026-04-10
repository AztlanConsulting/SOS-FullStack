import type {
  PaymentApi,
  PaymentOrderId,
  PaymentSuccess,
} from '@domain/ports/paypal.port';
import 'crypto';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ENVIROMENT = process.env.ENVIROMENT;
const CLIENT_ID = process.env.PAYPAL_CLIENT;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

const ENDPOINT_URL =
  ENVIROMENT === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const paypalApi: PaymentApi = {
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

  async createOrder() {
    const { accessToken, error } = await paypalApi.getAccessToken();

    if (error !== null) {
      return { orderId: null, error };
    }

    let orderDataJson = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: 'Simple search plan',
              description: 'Add to search for your dogs',
              quantity: '1',
              unit_amount: {
                currency_code: 'USD',
                value: '50.00',
              },
            },
          ],
          amount: {
            currency_code: 'USD',
            value: '50.00',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '50.00',
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

    let data = JSON.stringify(orderDataJson);

    const paymentId: Promise<PaymentOrderId> = fetch(
      ENDPOINT_URL + '/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Paypal-Request-Id': randomUUID(),
        },
        body: data,
      },
    )
      .then((res) => res.json())
      .then((data) => {
        return {
          orderId: data.id,
          error: null,
        };
      })
      .catch((error: string) => {
        console.error(error);
        return { orderId: null, error };
      });

    return paymentId; // Send to browser
  },

  async completeOrder(orderId: string) {
    const { accessToken, error } = await paypalApi.getAccessToken();

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
};

export default paypalApi;
