import { apiClient } from '@/api/client';

export const logTemplateService = {
  async list() {
    const { data } = await apiClient.get('/templates');
    return data || [];
  },

  async create(templateData) {
    const { data } = await apiClient.post('/templates', templateData);
    return data;
  },

  async remove(id) {
    await apiClient.delete(`/templates/${id}`);
  },
};
