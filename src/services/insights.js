import { apiClient } from '@/api/client';

export const insightService = {
  async getLatest() {
    const { data } = await apiClient.get('/insights', { params: { limit: 1, sort: '-createdAt' } });
    return data[0] || null;
  },

  async generate() {
    const { data } = await apiClient.post('/ai/insights');
    return data;
  },

  async removeAll() {
    await apiClient.delete('/insights');
  },
};

export const aiService = {
  async generateDoctorSummary(period) {
    const { data } = await apiClient.post('/ai/summary/doctor-report', { period });
    return data.summary;
  },
};
