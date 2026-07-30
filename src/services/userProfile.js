import { apiClient } from '@/api/client';

export const userProfileService = {
  async get() {
    const { data } = await apiClient.get('/profile');
    return data;
  },

  async create(profileData) {
    const { data } = await apiClient.post('/profile', profileData);
    return data;
  },

  async update(profileData) {
    const { data } = await apiClient.put('/profile', profileData);
    return data;
  },

  async remove() {
    await apiClient.delete('/profile');
  },
};
