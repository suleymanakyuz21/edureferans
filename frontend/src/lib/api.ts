import axios from 'axios';

// All API calls go to Next.js API routes (same origin)
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  // Ensures cookies (HttpOnly auth cookie) are sent with every request
  withCredentials: true,
});

// Response interceptor: redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
