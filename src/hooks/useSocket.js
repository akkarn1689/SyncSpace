// src/hooks/useSocket.js
import { useEffect, useCallback, useState } from 'react';
import { socketService } from '../services/socket/socketService';
import { SOCKET_EVENTS } from '../services/socket/socketEvents';

export const useSocket = (token) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                // console.log('Attempting socket connection with token');
                socketService.connect(token);

                const handleConnect = () => {
                    // console.log('Socket connected successfully');
                    setIsConnected(true);
                };

                const handleDisconnect = (reason) => {
                    // console.log('Socket disconnected:', reason);
                    setIsConnected(false);
                };

                const handleConnectError = (err) => {
                    console.error('Socket connection error:', err);
                    setError(err);
                };

                socketService.on(SOCKET_EVENTS.CONNECT, handleConnect);
                socketService.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
                socketService.on(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);

                return () => {
                    socketService.off(SOCKET_EVENTS.CONNECT, handleConnect);
                    socketService.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
                    socketService.off(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
                    socketService.disconnect();
                };
            } catch (connectionError) {
                console.error('Socket connection initialization error:', connectionError);
                setError(connectionError);
            }
        }
    }, [token]);

    return { isConnected, error };
};