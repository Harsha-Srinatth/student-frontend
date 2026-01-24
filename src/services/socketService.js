import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

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
    if (this.socket?.connected) {
      console.log('Socket already connected');
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
      console.log('✅ Socket connected:', this.socket.id);
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
      
      this.emit('socket:connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('socket:disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.emit('socket:error', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('socket:reconnected', attemptNumber);
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
   */
  on(event, callback) {
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // If socket exists, attach listener immediately
    // Socket.IO will queue listeners if socket isn't connected yet
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn(`⚠️ Socket not initialized yet for event: ${event}. Listener will be attached when socket connects.`);
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

