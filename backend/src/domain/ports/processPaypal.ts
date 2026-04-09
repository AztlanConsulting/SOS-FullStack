const ENVIROMENT = process.env.ENVIROMENT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const ENDPOINT_URL =
  ENVIROMENT === 'sandbox'
    ? 'http://api-m.sandbox.paypal.com'
    : 'http://api-m.paypal.com';

export function getAccessToken() {
  const auth = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const data = 'grant_type=client_credentials';
  return fetch(ENDPOINT_URL + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
    },
    body: data,
  })
    .then((res) => res.json())
    .then((json) => json.access_token);
}
