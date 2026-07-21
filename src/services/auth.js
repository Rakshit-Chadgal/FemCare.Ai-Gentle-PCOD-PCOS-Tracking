import { apiClient } from '@/api/client';

export const authService = {
  async login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('femcare_token', data.token);
    return data.user;
  },

  async register(email, password) {
    await apiClient.post('/auth/register', { email, password });
  },

  async verifyOtp(email, otpCode) {
    const { data } = await apiClient.post('/auth/verify-otp', { email, otpCode });
    localStorage.setItem('femcare_token', data.token);
    return data;
  },

  async resendOtp(email) {
    await apiClient.post('/auth/resend-otp', { email });
  },

  loginWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/google`;
  },

  async me() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  async forgotPassword(email) {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(resetToken, newPassword) {
    await apiClient.post('/auth/reset-password', { resetToken, newPassword });
  },

  logout() {
    localStorage.removeItem('femcare_token');
  },
};
