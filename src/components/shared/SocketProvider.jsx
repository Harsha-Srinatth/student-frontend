import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import socketService from '../../services/socketService';
import { setConnectionStatus, clearRealtimeData } from '../../features/shared/realtimeSlice';

/**
 * Socket Provider Component
 * Manages socket connection lifecycle and initializes socket middleware
 * Should be placed high in the component tree (e.g., in App or MainDashboard)
 */
const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isConnected = useSelector((state) => state.realtime?.isConnected);

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get('token');
    
    if (!token) {
      // Disconnect socket if no token
      if (socketService.getIsConnected()) {
        socketService.disconnect();
        dispatch(setConnectionStatus({ isConnected: false }));
      }
      return;
    }

    // Connect socket if authenticated and not already connected
    if (!socketService.getIsConnected()) {
      const socket = socketService.connect();
      
      if (socket) {
        // Set up connection status listeners
        const handleConnect = () => {
          dispatch(setConnectionStatus({ isConnected: true }));
        };

        const handleDisconnect = (reason) => {
          dispatch(setConnectionStatus({ isConnected: false, error: reason }));
        };

        const handleError = (error) => {
          dispatch(setConnectionStatus({ isConnected: false, error: error.message }));
        };

        socketService.on('socket:connected', handleConnect);
        socketService.on('socket:disconnected', handleDisconnect);
        socketService.on('socket:error', handleError);

        // Cleanup listeners on unmount
        return () => {
          socketService.off('socket:connected', handleConnect);
          socketService.off('socket:disconnected', handleDisconnect);
          socketService.off('socket:error', handleError);
        };
      }
    }
  }, [dispatch, location.pathname]);

  // Cleanup on logout or when navigating away from authenticated routes
  useEffect(() => {
    const token = Cookies.get('token');
    
    if (!token && socketService.getIsConnected()) {
      socketService.disconnect();
      dispatch(clearRealtimeData());
      dispatch(setConnectionStatus({ isConnected: false }));
    }
  }, [dispatch, location.pathname]);

  return <>{children}</>;
};

export default SocketProvider;

