// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { socketService } from '../services/socket/socketService';
import { SOCKET_EVENTS } from '../services/socket/socketEvents';

// Create the SocketContext
const SocketContext = createContext(null);

// SocketProvider component
export const SocketProvider = ({ children }) => {
    // Use Redux selector to get token from auth state
    const { token } = useSelector((state) => state.auth);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    // Connection handler
    const handleConnect = useCallback(() => {
        console.log('Socket connected successfully');
        setIsConnected(true);
        setError(null);
    }, []);

    // Disconnection handler
    const handleDisconnect = useCallback((reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
    }, []);

    // Connection error handler
    const handleConnectError = useCallback((err) => {
        console.error('Socket connection error:', err);
        setError(err);
        setIsConnected(false);
    }, []);

    // Socket methods to expose through context
    const socketMethods = {
        sendMessage: socketService.sendMessage.bind(socketService),
        sendGroupMessage: socketService.sendGroupMessage.bind(socketService),
        joinGroup: socketService.joinGroup.bind(socketService),
        leaveGroup: socketService.leaveGroup.bind(socketService),
        sendFriendRequest: socketService.sendFriendRequest.bind(socketService),
        acceptFriendRequest: socketService.acceptFriendRequest.bind(socketService),
        rejectFriendRequest: socketService.rejectFriendRequest.bind(socketService),
        markNotificationAsRead: socketService.markNotificationAsRead.bind(socketService),
        markMessageAsRead: socketService.markMessageAsRead.bind(socketService),
        startTyping: socketService.startTyping.bind(socketService),
        stopTyping: socketService.stopTyping.bind(socketService),
        on: socketService.on.bind(socketService),
        off: socketService.off.bind(socketService),
        emit: socketService.emit.bind(socketService),
        isConnected: socketService.isConnected.bind(socketService),
        getConnectionState: socketService.getConnectionState.bind(socketService)
    };

    // Effect to manage socket connection
    useEffect(() => {
        // Only attempt connection if token exists
        if (token) {
            try {
                console.log('Attempting socket connection with token');
                socketService.connect(token);

                // Add event listeners
                socketService.on(SOCKET_EVENTS.CONNECT, handleConnect);
                socketService.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
                socketService.on(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);

                // Cleanup function
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
    }, [token, handleConnect, handleDisconnect, handleConnectError]);

    // Context value
    const contextValue = {
        ...socketMethods,
        isConnected,
        error
    };

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === null) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};