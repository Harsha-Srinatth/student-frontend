import Cookies from 'js-cookie';
import axios from 'axios';

/**
 * API Configuration
 * Uses VITE_API_URL environment variable (Vite requires VITE_ prefix)
 * 
 * To set in Vercel:
 * - Go to Settings → Environment Variables
 * - Add: VITE_API_URL = https://your-backend.vercel.app
 * - Apply to: Production, Preview, Development
 */
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Get API base URL from environment variable
let API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || '';

// Handle missing or invalid API URL
if (!API_BASE_URL) {
  if (isProduction) {
    // In production, this is a critical error
    console.error('❌ VITE_API_URL is not set in production!');
    console.error('Please set VITE_API_URL in Vercel environment variables.');
    console.error('Example: https://your-backend.vercel.app');
    // Don't set a fallback in production - fail explicitly
    API_BASE_URL = '';
  } else {
    // Development fallback
    API_BASE_URL = 'http://localhost:3000';
    console.log('🔧 Development mode: Using default API URL:', API_BASE_URL);
  }
} else {
  // Validate URL format
  if (/^\d+$/.test(API_BASE_URL)) {
    // If it's just a port number, construct full URL
    API_BASE_URL = isProduction 
      ? '' // Invalid in production
      : `http://localhost:${API_BASE_URL}`;
  } else if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
    // Invalid format
    if (isProduction) {
      console.error('❌ Invalid VITE_API_URL format. Must be a full URL (e.g., https://api.example.com)');
      API_BASE_URL = '';
    } else {
      API_BASE_URL = 'http://localhost:3000';
    }
  }
  
  // Log in development only (for security)
  if (isDevelopment) {
    console.log('🌐 API Base URL:', API_BASE_URL);
  }
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
