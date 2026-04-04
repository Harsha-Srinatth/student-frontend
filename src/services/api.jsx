import Cookies from 'js-cookie';
import axios from 'axios';
import { SERVER_URL } from '../config/serverUrl';

// Store navigation function - will be set by App component
let navigateFunction = null;

// Export function to set navigate function from App component
export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

const api = axios.create({
  baseURL: SERVER_URL,
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
export { SERVER_URL };
