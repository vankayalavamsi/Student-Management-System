import axios from 'axios';

const api = axios.create({
  baseURL: 'https://student-management-backend-a2i3.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
