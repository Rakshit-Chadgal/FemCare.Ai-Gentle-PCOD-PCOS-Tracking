import { apiClient } from '@/api/client';

export const userProfileService = {
  async get() {
    try {
      const { data } = await apiClient.get('/profiles/me');
      return data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  // Both create and update use the same upsert endpoint
  async create(payload) {
    const { data } = await apiClient.post('/profiles/me', payload);
    return data;
  },

  async update(payload) {
    const { data } = await apiClient.post('/profiles/me', payload);
    return data;
  },

  async remove() {
    await apiClient.delete('/profiles/me');
  },
};
