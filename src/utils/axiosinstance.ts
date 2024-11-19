import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',  // Base URL for your API
});

// Add a request interceptor to include the token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
