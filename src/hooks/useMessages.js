// src/hooks/useMessages.js
import { useEffect, useCallback, useState } from 'react';
import { socketService } from '../services/socketService';
import { SOCKET_EVENTS } from '../services/socketEvents';

export const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleNewMessage = (message) => {
            setMessages(prev => [...prev, message]);
        };

        socketService.on(SOCKET_EVENTS.CONVERSATION_MESSAGE_RECEIVED, handleNewMessage);
        socketService.on(SOCKET_EVENTS.GROUP_MESSAGE_RECEIVED, handleNewMessage);

        return () => {
            socketService.off(SOCKET_EVENTS.CONVERSATION_MESSAGE_RECEIVED, handleNewMessage);
            socketService.off(SOCKET_EVENTS.GROUP_MESSAGE_RECEIVED, handleNewMessage);
        };
    }, []);

    const sendMessage = useCallback(async (recipientId, message, messageType = 'text') => {
        setLoading(true);
        try {
            const response = await socketService.sendMessage(recipientId, message, messageType);
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendGroupMessage = useCallback(async (groupId, message, messageType = 'text') => {
        setLoading(true);
        try {
            const response = await socketService.sendGroupMessage(groupId, message, messageType);
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    return { messages, loading, sendMessage, sendGroupMessage };
};