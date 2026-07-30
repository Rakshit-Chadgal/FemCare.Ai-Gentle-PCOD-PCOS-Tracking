import { apiClient } from '@/api/client';

const insightService = {
  async generate(insightData) {
    if (!insightData) return null;
    try {
      const { data } = await apiClient.post('/insights', {
        title: 'AI Awareness Summary',
        content: JSON.stringify(insightData),
        insight_type: 'general',
        data: insightData,
        is_actionable: insightData.doctor_nudge || false,
      });
      return data;
    } catch {
      return null;
    }
  },

  async getLatest() {
    try {
      const { data } = await apiClient.get('/insights');
      if (data && data.data) {
        return { ...data.data, id: data.id, created_date: data.generated_at };
      }
      return data;
    } catch {
      return null;
    }
  },

  async removeAll() {
    try {
      await apiClient.delete('/insights');
    } catch { /* ignore */ }
    return { deleted: true };
  },
};

export { insightService };
