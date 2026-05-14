import api from './api';

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.patch('/user/profile', data),
};

export const referralService = {
  getStats: () => api.get('/referral/stats'),
  upgradePremium: () => api.post('/referral/upgrade'),
};
