import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

// Store navigation function - will be set by App component
let navigateFunction = null;

// Export function to set navigate function from App component
export const setSocketNavigate = (navigate) => {
  navigateFunction = navigate;
};

/**
 * Socket.IO Service
 * Manages a single socket connection for the entire application
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Initialize socket connection
   */
  connect() {
    // Early return if already connected - don't log at all to avoid spam
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = Cookies.get('token');
    if (!token) {
      console.warn('No token found, cannot connect socket');
      return null;
    }

    // Get API base URL from environment or default
    // Use the same logic as api.jsx to ensure consistency
    let API_BASE_URL = import.meta.env.VITE_API_URL;

    // Debug: Log the raw env variable
    if (import.meta.env.DEV) {
      console.log('Raw VITE_API_URL:', API_BASE_URL);
    }

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

    // Socket.IO uses the same URL as the API, it handles the protocol internally
    const socketUrl = API_BASE_URL;

    // Final validation - ensure we have a valid URL
    if (!socketUrl || (!socketUrl.startsWith('http://') && !socketUrl.startsWith('https://'))) {
      console.error('Invalid socket URL constructed:', socketUrl, 'from VITE_API_URL:', import.meta.env.VITE_API_URL);
      console.error('Falling back to http://localhost:3000');
      // Use default URL
      const defaultUrl = 'http://localhost:3000';
      console.log('Connecting to socket server (fallback):', defaultUrl);
      this.socket = io(defaultUrl, {
        auth: { token: token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 20000,
        upgrade: true,
        rememberUpgrade: true,
      });
    } else {
      console.log('Connecting to socket server:', socketUrl);
      this.socket = io(socketUrl, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 20000,
        // Force upgrade to websocket after initial connection
        upgrade: true,
        // Remember transport preference
        rememberUpgrade: true,
      });
    }

    // Connection event handlers
    this.socket.on('connect', () => {
      // Socket ID might be undefined initially, wait a bit for it to be set
      const socketId = this.socket.id || 'connecting...';
      console.log('✅ Socket connected:', socketId);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Attach any listeners that were registered before connection
      // Socket.IO queues listeners, but we ensure they're all attached
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          // Check if listener is already attached to avoid duplicates
          const existingListeners = this.socket.listeners(event);
          if (!existingListeners.includes(callback)) {
            this.socket.on(event, callback);
            console.log(`📌 Attached listener for event: ${event}`);
          }
        });
      });
      
      // Trigger socket:connected event for local listeners
      // Use setTimeout to ensure all listeners are attached first
      setTimeout(() => {
        this.triggerLocalEvent('socket:connected');
      }, 0);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.triggerLocalEvent('socket:disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      
      // Check if error is due to authentication failure (token expired or invalid)
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes('Authentication') || 
          errorMessage.includes('jwt expired') || 
          errorMessage.includes('TokenExpiredError') ||
          errorMessage.includes('Authentication failed')) {
        
        // Get user role before clearing cookies
        const userRole = Cookies.get('userRole');
        
        // Clear all authentication cookies
        Cookies.remove('token');
        Cookies.remove('userRole');
        
        // Disconnect socket
        this.disconnect();
        
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
          console.warn('🔒 Socket authentication failed. Token expired. Redirecting to login page...');
          navigateFunction(loginPath);
        } else {
          // Fallback: use window.location if navigate is not available
          console.warn('🔒 Socket authentication failed. Token expired. Redirecting to login page...');
          window.location.href = loginPath;
        }
        
        // Don't attempt reconnection for auth errors
        return;
      }
      
      // For other errors, allow reconnection attempts
      this.reconnectAttempts++;
      this.emit('socket:error', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Trigger socket:reconnected event for local listeners
      setTimeout(() => {
        this.triggerLocalEvent('socket:reconnected', attemptNumber);
      }, 0);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnect attempt:', attemptNumber);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after', this.maxReconnectAttempts, 'attempts');
      this.emit('socket:reconnect_failed');
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  /**
   * Subscribe to a socket event
   * Prevents duplicate listeners by checking if callback already exists
   */
  on(event, callback) {
    // Check if this callback is already registered for this event
    if (this.listeners.has(event)) {
      const existingCallbacks = this.listeners.get(event);
      if (existingCallbacks.includes(callback)) {
        console.log(`⚠️ Listener already registered for event: ${event}, skipping duplicate`);
        return;
      }
    }

    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // If socket exists, attach listener immediately
    // Socket.IO will queue listeners if socket isn't connected yet
    if (this.socket) {
      // Check if listener is already attached to socket to avoid duplicates
      const existingListeners = this.socket.listeners(event);
      if (!existingListeners.includes(callback)) {
        this.socket.on(event, callback);
      }
    } else {
      // Only log in development mode to reduce console noise
      // This is expected behavior - listeners will be attached when socket connects
      if (import.meta.env.DEV) {
        // Only log for non-local events to reduce noise
        if (!event.startsWith('socket:')) {
          console.log(`📌 Queueing listener for event: ${event} (will attach when socket connects)`);
        }
      }
    }
  }

  /**
   * Unsubscribe from a socket event
   */
  off(event, callback) {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
      const listeners = this.listeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      // Remove all listeners for this event
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event, data) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot emit:', event);
      return;
    }

    this.socket.emit(event, data);
  }

  /**
   * Trigger local event callbacks (for events like socket:connected, socket:reconnected)
   * These are not sent to the server, but trigger local listeners
   */
  triggerLocalEvent(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  /**
   * Get socket instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  getIsConnected() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Reconnect socket (useful after token refresh)
   */
  reconnect() {
    this.disconnect();
    return this.connect();
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

