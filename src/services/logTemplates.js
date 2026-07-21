import { apiClient } from '@/api/client';

export const logTemplateService = {
  async list() {
    const { data } = await apiClient.get('/log-templates');
    return data;
  },

  async create(payload) {
    const { data } = await apiClient.post('/log-templates', payload);
    return data;
  },

  async remove(id) {
    await apiClient.delete(`/log-templates/${id}`);
  },
};
