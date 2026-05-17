import api from '@/lib/api';

export const authService = {
  register: (data: { name: string; email: string; password: string; referralCode?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  verify: (data: { email: string; code: string }) => api.post('/auth/verify', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};
