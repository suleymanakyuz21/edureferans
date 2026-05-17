import api from '@/lib/api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/admin/users', { params }),
  getUserDetails: (id: number) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: number, data: { isActive?: boolean; isPremium?: boolean }) =>
    api.patch(`/admin/users/${id}`, data),
  getPayouts: (params?: { status?: string; page?: number }) =>
    api.get('/admin/payouts', { params }),
  updatePayout: (data: { id: number; status: 'PROCESSING' | 'COMPLETED' | 'REJECTED'; adminNote?: string }) =>
    api.patch('/admin/payouts', data),
  createCourse: (data: unknown) => api.post('/admin/courses', data),
  createAnnouncement: (data: unknown) => api.post('/admin/announcements', data),
};
