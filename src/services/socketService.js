import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

let navigateFunction = null;
export const setSocketNavigate = (navigate) => { navigateFunction = navigate; };

/**
 * Socket.IO Service — singleton
 * SocketProvider owns connection lifecycle.
 * socketMiddleware registers event listeners.
 * Components use emitWhenReady() to emit after socket is connected.
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();       // persistent listener registry
    this.pendingEmits = [];           // queued emits waiting for connection
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // ─── Connection ───────────────────────────────────────

  connect() {
    if (this.socket?.connected) return this.socket;

    const token = Cookies.get('token');
    if (!token) return null;

    let url = import.meta.env.VITE_API_URL?.trim();
    if (!url || /^\d+$/.test(url)) url = 'http://localhost:3000';
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://localhost:3000';

    this.socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: true,
    });

    // ── Core socket.io events ──

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Re-attach all persistent listeners to the (possibly new) socket
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          if (!this.socket.listeners(event).includes(cb)) {
            this.socket.on(event, cb);
          }
        });
      });

      // Flush any emits that were queued while disconnected
      this._flushPendingEmits();

      // Notify local subscribers (connection status etc.)
      this._triggerLocal('socket:connected');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this._triggerLocal('socket:disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      const msg = error.message || '';
      if (msg.includes('Authentication') || msg.includes('jwt expired') ||
          msg.includes('TokenExpiredError') || msg.includes('Authentication failed')) {
        const role = Cookies.get('userRole');
        Cookies.remove('token');
        Cookies.remove('userRole');
        this.disconnect();
        const path = role === 'student' ? '/login/student'
          : role === 'faculty' ? '/login/faculty'
          : role === 'hod' ? '/hod/login'
          : '/landing/page';
        navigateFunction ? navigateFunction(path) : (window.location.href = path);
        return;
      }
      this.reconnectAttempts++;
      this._triggerLocal('socket:error', error);
    });

    this.socket.on('reconnect', (n) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this._flushPendingEmits();
      this._triggerLocal('socket:reconnected', n);
    });

    this.socket.on('reconnect_failed', () => {
      this._triggerLocal('socket:reconnect_failed');
    });

    return this.socket;
  }

  /**
   * Disconnect socket but KEEP listener registry.
   * Listeners are re-attached automatically on next connect().
   */
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.pendingEmits = [];
    // NOTE: we do NOT clear this.listeners — they survive reconnects
  }

  /** Full teardown — clears everything (call on logout) */
  destroy() {
    this.disconnect();
    this.listeners.clear();
  }

  // ─── Event Listeners ──────────────────────────────────

  /**
   * Register a persistent listener.
   * Survives disconnect/reconnect cycles.
   * Local events (socket:*) are NOT attached to the actual socket.
   */
  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    const arr = this.listeners.get(event);
    if (arr.includes(callback)) return; // dedup by reference
    arr.push(callback);

    // Attach to live socket if it exists AND event is a real server event
    if (this.socket && !event.startsWith('socket:')) {
      if (!this.socket.listeners(event).includes(callback)) {
        this.socket.on(event, callback);
      }
    }
  }

  /**
   * Remove a listener. Works even if socket is null.
   */
  off(event, callback) {
    if (callback) {
      // Remove from persistent registry
      const arr = this.listeners.get(event);
      if (arr) {
        const idx = arr.indexOf(callback);
        if (idx > -1) arr.splice(idx, 1);
        if (arr.length === 0) this.listeners.delete(event);
      }
      // Remove from live socket if exists
      if (this.socket) this.socket.off(event, callback);
    } else {
      // Remove ALL listeners for this event
      this.listeners.delete(event);
      if (this.socket) this.socket.off(event);
    }
  }

  // ─── Emit ─────────────────────────────────────────────

  /** Emit immediately — drops if not connected */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  /** Emit when ready — queues the emit if not connected yet */
  emitWhenReady(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      this.pendingEmits.push({ event, data });
    }
  }

  // ─── Internals ────────────────────────────────────────

  _flushPendingEmits() {
    if (!this.socket || !this.isConnected) return;
    const queue = this.pendingEmits.splice(0);
    queue.forEach(({ event, data }) => this.socket.emit(event, data));
  }

  /** Fire local-only events (socket:connected etc.) */
  _triggerLocal(event, data) {
    const cbs = this.listeners.get(event);
    if (cbs) cbs.forEach((cb) => { try { cb(data); } catch (e) { console.error(`[socket:${event}]`, e); } });
  }

  // ─── Getters ──────────────────────────────────────────

  getSocket() { return this.socket; }
  getIsConnected() { return this.isConnected && !!this.socket?.connected; }
  reconnect() { this.disconnect(); return this.connect(); }
}

const socketService = new SocketService();
export default socketService;
