import type { PaymentApi } from '@domain/ports/paypal.port';
import 'crypto';
import { randomUUID } from 'crypto';

const ENVIROMENT = process.env.ENVIROMENT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const ENDPOINT_URL =
  ENVIROMENT === 'sandbox'
    ? 'http://api-m.sandbox.paypal.com'
    : 'http://api-m.paypal.com';

const paypalApi: PaymentApi = {
  async getAccessToken() {
    const auth = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const data = 'grant_type=client_credentials';
    const [accessToken, error] = await fetch(
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
      .then((res) => res.json())
      .then((json) => [json.access_token, null])
      .catch((err) => {
        console.error("Error generating paypal's access token: ", err);
        return [null, err];
      });

    return { accessToken, error };
  },

  async processPayment(intent: string) {
    const accessToken = await paypalApi.getAccessToken();
    let orderDataJson = {
      intent: intent.toUpperCase(),
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

    const paymentId: Promise<string | null[]> = fetch(
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
      .then((data) => [data.id, null])
      .catch((err) => {
        console.error(err);
        return [null, err];
      });

    return paymentId; // Send to browser
  },

  async completeOrder(orderId: string, intent: string) {
    const accessToken = await paypalApi.getAccessToken();
    const response: Promise<string | null[]> = fetch(
      ENDPOINT_URL + '/v2/checkout/orders' + orderId + '/' + intent,
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
        console.log(json);
        return [json, null];
      })
      .catch((err) => {
        console.error(err);
        return [null, err];
      });

    return response;
  },
};
