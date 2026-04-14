export const getManuals = async () => {
  try {
    const base_url = import.meta.env.VITE_REACT_APP_API_URL;
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

export const getManualById = async (id: string) => {
  try {
    const base_url = import.meta.env.VITE_REACT_APP_API_URL;
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
