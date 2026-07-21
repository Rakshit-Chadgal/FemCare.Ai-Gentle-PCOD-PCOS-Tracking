import { apiClient } from '@/api/client';

export const symptomLogService = {
  async list(limit = 200) {
    const { data } = await apiClient.get('/symptom-logs', { params: { limit, sort: '-logDate' } });
    return data;
  },

  async getByDate(date) {
    const { data } = await apiClient.get(`/symptom-logs/${date}`);
    return data; // null if 404
  },

  async create(payload) {
    const { data } = await apiClient.post('/symptom-logs', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/symptom-logs/${id}`, payload);
    return data;
  },

  async remove(id) {
    await apiClient.delete(`/symptom-logs/${id}`);
  },

  async removeAll() {
    await apiClient.delete('/symptom-logs');
  },
};
