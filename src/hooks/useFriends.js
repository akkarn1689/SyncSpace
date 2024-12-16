// src/hooks/useFriends.js
import { useEffect, useCallback, useState } from 'react';
import { socketService } from '../services/socketService';
import { SOCKET_EVENTS } from '../services/socketEvents';

export const useFriends = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState(new Set());

    useEffect(() => {
        const handleFriendRequest = (request) => {
            setFriendRequests(prev => [...prev, request]);
        };

        const handleUserPresence = ({ userId, status }) => {
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                status === 'online' ? newSet.add(userId) : newSet.delete(userId);
                return newSet;
            });
        };

        socketService.on(SOCKET_EVENTS.FRIEND_REQUEST_RECEIVED, handleFriendRequest);
        socketService.on(SOCKET_EVENTS.USER_PRESENCE_CHANGED, handleUserPresence);

        return () => {
            socketService.off(SOCKET_EVENTS.FRIEND_REQUEST_RECEIVED, handleFriendRequest);
            socketService.off(SOCKET_EVENTS.USER_PRESENCE_CHANGED, handleUserPresence);
        };
    }, []);

    const sendFriendRequest = useCallback((recipientId) => {
        socketService.sendFriendRequest(recipientId);
    }, []);

    const respondToFriendRequest = useCallback((requestId, accept) => {
        if (accept) {
            socketService.acceptFriendRequest(requestId);
        } else {
            socketService.rejectFriendRequest(requestId);
        }
        setFriendRequests(prev => prev.filter(req => req._id !== requestId));
    }, []);

    return { 
        friendRequests, 
        onlineFriends, 
        sendFriendRequest, 
        respondToFriendRequest 
    };
};