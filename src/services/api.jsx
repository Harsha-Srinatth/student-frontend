import Cookies from 'js-cookie';
import axios from 'axios';

// Get API base URL from environment or use fallback
// Vite uses VITE_ prefix for environment variables
let API_BASE_URL = import.meta.env.VITE_API_URL;

// Check if we're in production (Vercel sets this automatically)
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// If no env variable is set
if (!API_BASE_URL || API_BASE_URL.trim() === '') {
  if (isProduction) {
    // In production, we MUST have an API URL - log error
    console.error('❌ VITE_API_URL environment variable is not set in production!');
    console.error('Please set VITE_API_URL in your Vercel environment variables.');
    // You can set a default production URL here if needed
    // API_BASE_URL = 'https://your-backend-api.vercel.app';
  } else {
    // Default to localhost for development
    API_BASE_URL = 'http://localhost:3000';
    console.log('🔧 Using default API URL for development:', API_BASE_URL);
  }
}

// If it's just a port number, construct the full URL
if (/^\d+$/.test(API_BASE_URL)) {
  API_BASE_URL = isProduction 
    ? `https://your-backend-api.vercel.app` // Replace with your actual backend URL
    : `http://localhost:${API_BASE_URL}`;
}

// Ensure API_BASE_URL is a valid full URL
if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  if (isProduction) {
    console.error('❌ Invalid VITE_API_URL format. Must be a full URL (e.g., https://api.example.com)');
  } else {
    API_BASE_URL = `http://localhost:3000`;
  }
}

// Log the API URL being used (only in development for security)
if (isDevelopment) {
  console.log('🌐 API Base URL:', API_BASE_URL);
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
