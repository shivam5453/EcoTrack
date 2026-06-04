import axios from 'axios';

// Get backend server address from Vite environment variables or fallback
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://ecotrack-backend-production-2fd0.up.railway.app/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for automatic httpOnly cookie transfer
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach credentials configuration to all outgoing requests
axiosInstance.interceptors.request.use(config => {
  // JWT is in httpOnly cookie — it's sent automatically
  // If using localStorage instead, add: config.headers.Authorization = `Bearer ${token}`
  config.withCredentials = true;
  return config;
});

// Automatic response interceptor for token refresh handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops by ignoring login or refresh endpoint failures
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        // Trigger silent token rotation call
        await axiosInstance.post('/auth/refresh');
        
        // Re-run original request with new cookies
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Session refresh failed:', refreshError.message);
        // Clear local storage and trigger redirect if in browser context
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
