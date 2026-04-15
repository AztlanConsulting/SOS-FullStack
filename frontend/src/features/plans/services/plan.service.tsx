/**
 * Fetches the list of available plans from the backend API.
 * Uses the environment-configured base URL to construct the endpoint path.
 * * @returns A promise that resolves to the plan data parsed from JSON.
 * @throws An error if the network request fails or the server returns a non-OK status.
 */
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
