import type { DetailOrder } from './../../domain/ports/paypal.port';
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
dotenv.config();

const ENVIRONMENT = process.env.ENVIRONMENT;
const CLIENT_ID = process.env.PAYPAL_CLIENT;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

const ENDPOINT_URL =
  ENVIRONMENT === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const PaypalProvider: PaypalApi = {
  // Get token to use paypal api
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

  async createOrder(
    data: PaymentIntentDTO,
    detailOrder: DetailOrder,
  ): Promise<PaymentIntentResult> {
    const { accessToken, error } = await PaypalProvider.getAccessToken();

    if (error !== null) {
      throw error;
    }

    let orderData = JSON.stringify(detailOrder);

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
      clientSecret: 'temp_client_secret',
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
};

export default PaypalProvider;
