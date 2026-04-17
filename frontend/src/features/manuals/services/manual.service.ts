/**
 * Fetches the complete list of manuals from the API.
 * @returns Promise resolving to manual list data with metadata
 * @throws Error if the fetch request fails or returns a non-2xx status
 */
export const getManuals = async () => {
  try {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${base_url}/manuals/getManuals`);
    if (!res.ok) {
      throw new Error('Failed to fetch manuals');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch manuals:', error);
    throw error;
  }
};

/**
 * Fetches a single manual by its ID from the API.
 * @param id - The MongoDB ObjectId of the manual to retrieve
 * @returns Promise resolving to the manual details
 * @throws Error if the fetch request fails or the manual ID does not exist
 */
export const getManualById = async (id: string) => {
  try {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${base_url}/manuals/getManualById/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch a manual by id');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch a manual by id:', error);
    throw error;
  }
};
