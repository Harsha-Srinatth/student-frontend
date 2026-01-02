import Cookies from 'js-cookie';
import axios from 'axios';

// Use environment variable or default to local development port
// For local dev: http://localhost:3000 (backend runs on port 3000)
// For Docker: http://localhost:8000
let API_BASE_URL = import.meta.env.VITE_API_URL;

// If no env variable or if it's just a port number, use default
if (!API_BASE_URL || /^\d+$/.test(API_BASE_URL)) {
  // Default to port 3000 for local development
  API_BASE_URL = 'http://localhost:3000';
}

// Ensure API_BASE_URL is a valid full URL (not just a port number)
if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  // If it's just a port number, construct the full URL
  if (/^\d+$/.test(API_BASE_URL)) {
    API_BASE_URL = `http://localhost:${API_BASE_URL}`;
  } else {
    // Default fallback to port 3000
    API_BASE_URL = 'http://localhost:3000';
  }
}

// Debug: Log the API base URL (remove in production)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,           // if you need cookies
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
