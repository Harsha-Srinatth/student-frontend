import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import socketService from '../../services/socketService';

/**
 * Socket Provider — owns connection lifecycle.
 * Connect when authenticated, disconnect on logout.
 * Event listeners are registered by socketMiddleware (not here).
 */
const SocketProvider = ({ children }) => {
  const location = useLocation();
  const connected = useRef(false);

  // Connect once when authenticated
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      if (connected.current) {
        socketService.disconnect();
        connected.current = false;
      }
      return;
    }
    if (!connected.current && !socketService.getIsConnected()) {
      socketService.connect();
      connected.current = true;
    }
  }, []);

  // Disconnect on logout (token removed while navigating)
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token && connected.current) {
      socketService.destroy(); // full teardown on logout
      connected.current = false;
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default SocketProvider;
