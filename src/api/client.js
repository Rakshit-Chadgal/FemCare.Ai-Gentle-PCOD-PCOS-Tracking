import axios from 'axios';

// Use VITE_API_BASE_URL if set (e.g. for separate Vercel + Render deployment), otherwise default to relative path
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    const customUrl = import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '');
    if (customUrl && customUrl !== 'undefined' && customUrl !== 'null') {
      return customUrl;
    }
  }
  return '';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
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
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('femcare_token');
    }

    // Network error fallback if VITE_API_BASE_URL points to an unreachable/offline remote backend
    if (!err.response && err.config && !err.config._retryRelative && getBaseUrl() !== '') {
      console.warn('[apiClient] Remote API network error, retrying with local relative route:', err.message);
      err.config._retryRelative = true;
      err.config.baseURL = '';
      return apiClient.request(err.config);
    }

    return Promise.reject(err);
  }
);

export { apiClient };

