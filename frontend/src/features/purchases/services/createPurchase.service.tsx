export const createPurchase = async (
  userEmail: string,
  paymentId: string,
  productId: string,
  productType: string,
) => {
  try {
    const base_url = import.meta.env.VITE_REACT_APP_API_URL;
    const res = await fetch(`${base_url}/purchases/createPurchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, paymentId, productId, productType }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error ?? 'Purchase creation failed');
    }

    return data.message;
  } catch (error) {
    console.error('Purchase creation failed:', error);
    throw error;
  }
};
