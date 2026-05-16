import api from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id: number) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: number, data: any) => api.patch(`/admin/users/${id}`, data),
  createCourse: (data: any) => api.post('/admin/courses', data),
  createAnnouncement: (data: any) => api.post('/admin/announcements', data),
};
