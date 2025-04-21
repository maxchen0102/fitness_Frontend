import axios from 'axios';
import authService from './authService';

// Request interceptor - adds the auth token to requests
axios.interceptors.request.use(
  (config) => {
    const tokens = authService.getTokens();
    if (tokens && tokens.access) {
      config.headers['Authorization'] = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles token expiration
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          // If token refresh successful, retry the original request
          return axios(originalRequest);
        } else {
          // If refresh failed, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh throws an error, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios; 
