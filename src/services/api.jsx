import Cookies from 'js-cookie';
import axios from 'axios';

// Store navigation function - will be set by App component
let navigateFunction = null;

// Export function to set navigate function from App component
export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

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
    // Development fallback - Backend runs on port 3000
    API_BASE_URL = 'http://localhost:3000';
    console.log('🔧 Development mode: Using default API URL:', API_BASE_URL);
  }
} else {
  // Validate URL format
  if (/^\d+$/.test(API_BASE_URL)) {
    // If it's just a port number, construct full URL
    // But if it's 5000 and backend is on 3000, override it
    if (API_BASE_URL === '5000' && isDevelopment) {
      console.warn('⚠️ VITE_API_URL is set to 5000, but backend runs on 3000. Using 3000 instead.');
      API_BASE_URL = 'http://localhost:3000';
    } else {
      API_BASE_URL = isProduction 
        ? '' // Invalid in production
        : `http://localhost:${API_BASE_URL}`;
    }
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
    console.log('✅ Frontend will connect to backend at:', API_BASE_URL);
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Get user role before clearing cookies
      const userRole = Cookies.get('userRole');
      
      // Clear all authentication cookies
      Cookies.remove('token');
      Cookies.remove('userRole');
      
      // Determine the appropriate login page based on user role
      let loginPath = '/landing/page'; // Default fallback
      
      if (userRole === 'student') {
        loginPath = '/login/student';
      } else if (userRole === 'faculty') {
        loginPath = '/login/faculty';
      } else if (userRole === 'hod') {
        loginPath = '/hod/login';
      } else if (userRole === 'admin') {
        loginPath = '/admin/login';
      }
      
      // Redirect to login page if navigate function is available
      if (navigateFunction) {
        console.warn('🔒 Token expired. Redirecting to login page...');
        navigateFunction(loginPath);
      } else {
        // Fallback: use window.location if navigate is not available
        console.warn('🔒 Token expired. Redirecting to login page...');
        window.location.href = loginPath;
      }
      
      // Return a rejected promise to stop the request chain
      return Promise.reject(error);
    }
    
    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default api;
