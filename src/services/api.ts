
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // Update with your API base URL
});

// Add request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ptng_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
