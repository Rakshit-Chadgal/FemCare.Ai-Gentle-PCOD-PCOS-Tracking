import { apiClient } from '@/api/client';

export const symptomLogService = {
  async list(limit = 100) {
    const { data } = await apiClient.get(`/symptoms?limit=${limit}`);
    return data;
  },

  async getById(id) {
    const { data } = await apiClient.get(`/symptoms/${id}`);
    return data;
  },

  async getByDate(date) {
    const { data } = await apiClient.get(`/symptoms?date=${date}`);
    return Array.isArray(data) ? data[0] : null;
  },

  async create(logData) {
    const { data } = await apiClient.post('/symptoms', logData);
    return data;
  },

  async update(id, logData) {
    const { data } = await apiClient.put(`/symptoms/${id}`, logData);
    return data;
  },

  async remove(id) {
    await apiClient.delete(`/symptoms/${id}`);
  },

  async removeAll() {
    await apiClient.delete('/symptoms');
  },
};
