import api from './api';

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verify: (data: { email: string; code: string }) => api.post('/auth/verify', data),
};
