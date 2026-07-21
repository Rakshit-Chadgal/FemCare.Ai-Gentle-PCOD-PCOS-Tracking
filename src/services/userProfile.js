import { apiClient } from '@/api/client';

export const userProfileService = {
  async get() {
    try {
      const { data } = await apiClient.get('/user-profile');
      return data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  async create(payload) {
    const { data } = await apiClient.post('/user-profile', payload);
    return data;
  },

  async update(payload) {
    const { data } = await apiClient.put('/user-profile', payload);
    return data;
  },

  async remove() {
    await apiClient.delete('/user-profile');
  },
};
