import axios from 'axios';

// Default to relative path '' in browser so requests use current window host & protocol
const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : (process.env.VITE_API_BASE_URL || ''),
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('femcare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('femcare_token');
    }
    return Promise.reject(err);
  }
);

export { apiClient };
