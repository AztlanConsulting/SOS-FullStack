import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + '/api',
  timeout: 8000,
  headers: {
    Accept: 'application/json',
  },
});

export default axiosInstance;
