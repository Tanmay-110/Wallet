import axios from 'axios';

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You *must* return config here
    return config;
  },
  (error) => {
    // Log and forward any request‐setup errors
    if (process.env.NODE_ENV === 'development') {
      console.error('API Request Error:', {
        message: error.message,
        response: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
