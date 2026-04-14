export const getPlans = async () => {
  try {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${base_url}/plans/getPlans`);
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};
