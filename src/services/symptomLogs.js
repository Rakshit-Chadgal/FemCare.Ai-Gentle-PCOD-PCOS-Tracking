import { apiClient } from '@/api/client';

export const symptomLogService = {
  async list(limit = 200) {
    const { data } = await apiClient.get('/symptom-logs', { params: { limit, sort: '-logDate' } });
    return data;
  },

  async getByDate(date) {
    try {
      const { data } = await apiClient.get(`/symptom-logs/${date}`);
      return data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  // Backend uses upsert by date — create and update are the same call
  async create(payload) {
    const { data } = await apiClient.post('/symptom-logs', payload);
    return data;
  },

  async update(id, payload) {
    // id is unused — backend upserts by (userId, logDate)
    const { data } = await apiClient.post('/symptom-logs', payload);
    return data;
  },

  async remove(id) {
    // id here is the log_date string (matches backend DELETE /:date)
    await apiClient.delete(`/symptom-logs/${id}`);
  },

  async removeAll() {
    await apiClient.delete('/symptom-logs');
  },
};
