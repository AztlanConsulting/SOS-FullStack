import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
  headers: {
    Accept: 'application/json',
  },
});

export default axiosInstance;
