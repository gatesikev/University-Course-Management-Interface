import axios from 'axios';

// Create a reusable axios instance
const api = axios.create({
  baseURL: 'https://student-management-system-backend.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor will automatically attach the token to every request 
// once the supervisor is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;