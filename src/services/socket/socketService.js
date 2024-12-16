// src/services/socketService.js

import io from 'socket.io-client';
import { SOCKET_EVENTS } from './socketEvents';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.connectionAttempts = 0;
        this.maxReconnectionAttempts = 5;
        this.socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    }

    connect(token) {
        if (this.socket?.connected) {
            console.log('Socket already connected');
            return;
        };

        const socketOptions = {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectionAttempts,
            reconnectionDelay: 1000,
            timeout: 10000,
            autoConnect: false,
            path: '/socket.io',
            withCredentials: true
        };

        try {
            console.log('Trying to Connect to socket:', this.socketUrl);
            this.socket = io(this.socketUrl, socketOptions);
            this.setupConnectionHandlers();
            this.socket.connect();

            this.socket.on('connect', () => {
                console.log('Connected to socket:', this.socket.id);
            });

            this.socket.on('connect_error', (error) => {
                this.connectionAttempts++;
                console.error('Connection Error:', error.message);

                if (this.connectionAttempts >= this.maxReconnectionAttempts) {
                    console.error('Maximum reconnection attempts reached');
                    this.socket.disconnect();
                    this.emit(SOCKET_EVENTS.CONNECTION_FAILED, {
                        error: 'Maximum reconnection attempts reached'
                    });
                }
            });

            this.socket.on('error', (error) => {
                console.error('Socket Error:', error);
            });
        } catch (error) {
            console.error('Socket initialization error:', error);
            throw new Error(`Failed to initialize socket: ${error.message}`);
        }
    }

    setupConnectionHandlers() {
        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('Socket connected successfully');
            this.connectionAttempts = 0;

            this.socket.emit('ping');
            this.socket.once('pong', () => {
                console.log('Connection verified with server');
            });
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log('Socket disconnected:', reason);

            if (reason === 'io server disconnect') {
                console.log('Server initiated disconnect');
            } else if (reason === 'transport close') {
                if (this.connectionAttempts < this.maxReconnectionAttempts) {
                    console.log('Attempting to reconnect...');
                    this.socket.connect();
                }
            }
        });

        let lastPing = Date.now();

        setInterval(() => {
            if (this.socket?.connected) {
                this.socket.emit('ping');
                lastPing = Date.now();
            }
        }, 25000);

        this.socket.on('pong', () => {
            const latency = Date.now() - lastPing;
            if (latency > 5000) {
                console.warn('High latency detected:', latency, 'ms');
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    async sendMessage(recipientId, message, messageType = 'text') {
        return new Promise((resolve, reject) => {
            if (!this.isConnected()) {
                return reject(new Error('Socket is not connected'));
            }

            console.log('Sending message:', { recipientId, message, messageType });

            // Use a more robust timeout and error handling
            // const timeout = setTimeout(() => {
            //     reject(new Error('Message sending timeout'));
            // }, 10000);

            this.socket.emit(SOCKET_EVENTS.SEND_CONVERSATION_MESSAGE, {
                recipientId,
                message,
                messageType,
                timestamp: Date.now()
            }, (error, response) => {
                // clearTimeout(timeout);
                if (error) {
                    console.error('Message send error:', error);
                    reject(error);
                } else {
                    console.log('Message send response:', response);
                    resolve(response);
                }
            });

            console.log('console after emit message');
        });
    }

    async sendGroupMessage(groupId, message, messageType = 'text') {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Message sending timeout'));
            }, 5000);

            this.socket.emit(SOCKET_EVENTS.SEND_GROUP_MESSAGE, {
                groupId,
                message,
                messageType,
                timestamp: Date.now()
            });

            this.socket.once(SOCKET_EVENTS.MESSAGE_DELIVERED, (response) => {
                clearTimeout(timeout);
                resolve(response);
            });

            this.socket.once(SOCKET_EVENTS.ERROR, (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }

    joinGroup(groupId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.JOIN_GROUP, groupId);
    }

    leaveGroup(groupId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.LEAVE_GROUP, groupId);
    }

    sendFriendRequest(recipientId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.FRIEND_REQUEST_SENT, { recipientId });
    }

    acceptFriendRequest(requestId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED, { requestId });
    }

    rejectFriendRequest(requestId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.FRIEND_REQUEST_REJECTED, { requestId });
    }

    markNotificationAsRead(notificationId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.NOTIFICATION_READ, notificationId);
    }

    markMessageAsRead(messageId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.CONVERSATION_MESSAGE_READ, { messageId });
    }

    startTyping(recipientId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.TYPING_START, { recipientId });
    }

    stopTyping(recipientId) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        this.socket.emit(SOCKET_EVENTS.TYPING_END, { recipientId });
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        this.socket?.on(event, callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
        this.socket?.off(event, callback);
    }

    emit(event, data) {
        if (!this.isConnected()) {
            throw new Error('Socket is not connected');
        }
        console.log("emitting data", data);
        this.socket.emit(event, data);
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    getConnectionState() {
        if (!this.socket) return 'CLOSED';
        return this.socket.connected ? 'CONNECTED' : 'DISCONNECTED';
    }
}

export const socketService = new SocketService();