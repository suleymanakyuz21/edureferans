import api from '@/lib/api';

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: unknown) => api.patch('/user/profile', data),
};

export const referralService = {
  getStats: () => api.get('/referral/stats'),
};

export const walletService = {
  getPayouts: () => api.get('/wallet/payout'),
  createPayout: (data: { method: 'IBAN' | 'PAPARA'; amount: number; iban?: string; paparaId?: string }) =>
    api.post('/wallet/payout', data),
};
