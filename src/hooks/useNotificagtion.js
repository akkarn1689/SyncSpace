// src/hooks/useNotifications.js
import { useEffect, useCallback, useState } from 'react';
import { socketService } from '../services/socketService';
import { SOCKET_EVENTS } from '../services/socketEvents';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleNewNotification = (notification) => {
            setNotifications(prev => [...prev, notification]);
        };

        socketService.on(SOCKET_EVENTS.NEW_NOTIFICATION, handleNewNotification);

        return () => {
            socketService.off(SOCKET_EVENTS.NEW_NOTIFICATION, handleNewNotification);
        };
    }, []);

    const markAsRead = useCallback((notificationId) => {
        socketService.markNotificationAsRead(notificationId);
        setNotifications(prev =>
            prev.map(notif =>
                notif._id === notificationId ? { ...notif, isRead: true } : notif
            )
        );
    }, []);

    return { notifications, markAsRead };
};