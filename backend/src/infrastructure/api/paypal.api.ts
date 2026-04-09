import type { PaymentApi, PaymentOrderId } from '@domain/ports/paypal.port';
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
        console.log(res.status);
        return res.json();
      })
      .then((json) => ({ accessToken: json.access_token, error: null }))
      .catch((error: string) => {
        console.error("Error generating paypal's access token: ", error);
        return { accessToken: null, error };
      });

    console.log(accessToken, error);
    return { accessToken, error };
  },

  async createOrder() {
    const { accessToken, error } = await paypalApi.getAccessToken();

    if (error) {
      return { orderId: null, error };
    }

    let orderDataJson = {
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '100.00',
          },
        },
      ],
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
      .then((data) => ({
        orderId: data.id,
        error: null,
      }))
      .catch((error: string) => {
        console.error(error);
        return { orderId: null, error };
      });

    return paymentId; // Send to browser
  },

  async completeOrder(orderId: string) {
    const accessToken = await paypalApi.getAccessToken();
    const response: Promise<string | null[]> = fetch(
      ENDPOINT_URL + '/v2/checkout/orders/' + orderId + '/capture',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((json) => {
        return [json, null];
      })
      .catch((err) => {
        console.error(err);
        return [null, err];
      });

    return response;
  },
};

export default paypalApi;
