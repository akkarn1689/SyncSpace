// src/services/socketEvents.js

export const SOCKET_EVENTS = {
    // Connection events
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    RECONNECT: 'reconnect',
    USER_CONNECTED: 'user_connected',
    USER_DISCONNECTED: 'user_disconnected',

    // Direct Message events
    SEND_CONVERSATION_MESSAGE: 'send_message',
    CONVERSATION_MESSAGE_RECEIVED: 'message_received',
    CONVERSATION_MESSAGE_READ: 'message_read',
    MESSAGE_DELIVERED: 'message_delivered',
    MESSAGE_DELETED: 'message_deleted',
    MESSAGE_EDITED: 'message_edited',

    // Media Message events
    SEND_MEDIA_MESSAGE: 'send_media_message',
    MEDIA_MESSAGE_RECEIVED: 'media_message_received',
    MEDIA_UPLOAD_PROGRESS: 'media_upload_progress',
    MEDIA_UPLOAD_COMPLETE: 'media_upload_complete',
    MEDIA_UPLOAD_ERROR: 'media_upload_error',

    // Typing events
    TYPING_START: 'typing_start',
    TYPING_END: 'typing_end',

    // Friend request events
    FRIEND_REQUEST_SENT: 'friend_request_sent',
    FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',
    FRIEND_REQUEST_REJECTED: 'friend_request_rejected',
    FRIEND_REQUEST_CANCELLED: 'friend_request_cancelled',
    FRIEND_REMOVED: 'friend_removed',

    // Group events
    CREATE_GROUP: 'create_group',
    JOIN_GROUP: 'join_group',
    LEAVE_GROUP: 'leave_group',
    GROUP_DELETED: 'group_deleted',
    GROUP_UPDATED: 'group_updated',
    SEND_GROUP_MESSAGE: 'send_group_message',
    GROUP_MESSAGE_RECEIVED: 'group_message_received',
    GROUP_MEMBER_ADDED: 'group_member_added',
    GROUP_MEMBER_REMOVED: 'group_member_removed',
    GROUP_ADMIN_UPDATED: 'group_admin_updated',

    // Chat History events
    FETCH_CHAT_HISTORY: 'fetch_chat_history',
    CHAT_HISTORY_RECEIVED: 'chat_history_received',
    LOAD_MORE_MESSAGES: 'load_more_messages',
    MORE_MESSAGES_RECEIVED: 'more_messages_received',

    // Notification events
    NEW_NOTIFICATION: 'new_notification',
    NOTIFICATION_READ: 'notification_read',
    CLEAR_NOTIFICATIONS: 'clear_notifications',

    // Status events
    ONLINE_STATUS: 'online_status',
    USER_PRESENCE_CHANGED: 'user_presence_changed',
    LAST_SEEN_UPDATED: 'last_seen_updated',

    // Error events
    ERROR: 'error',
    VALIDATION_ERROR: 'validation_error',
    AUTHORIZATION_ERROR: 'authorization_error',

    // Room events
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    ROOM_JOINED: 'room_joined',
    ROOM_LEFT: 'room_left',

    // Message Status events
    MESSAGE_STATUS_CHANGED: 'message_status_changed',
    MESSAGE_REACTION_ADDED: 'message_reaction_added',
    MESSAGE_REACTION_REMOVED: 'message_reaction_removed',

    // User Activity events
    USER_ACTIVITY_STATUS: 'user_activity_status',
    USER_SETTINGS_UPDATED: 'user_settings_updated',
    USER_PROFILE_UPDATED: 'user_profile_updated'
};

// Event Categories for better organization
export const EVENT_CATEGORIES = {
    CONNECTION: [
        SOCKET_EVENTS.CONNECT,
        SOCKET_EVENTS.DISCONNECT,
        SOCKET_EVENTS.CONNECT_ERROR,
        SOCKET_EVENTS.RECONNECT,
        SOCKET_EVENTS.USER_CONNECTED,
        SOCKET_EVENTS.USER_DISCONNECTED
    ],
    MESSAGES: [
        SOCKET_EVENTS.SEND_CONVERSATION_MESSAGE,
        SOCKET_EVENTS.CONVERSATION_MESSAGE_RECEIVED,
        SOCKET_EVENTS.CONVERSATION_MESSAGE_READ,
        SOCKET_EVENTS.MESSAGE_DELIVERED,
        SOCKET_EVENTS.MESSAGE_DELETED,
        SOCKET_EVENTS.MESSAGE_EDITED
    ],
    MEDIA: [
        SOCKET_EVENTS.SEND_MEDIA_MESSAGE,
        SOCKET_EVENTS.MEDIA_MESSAGE_RECEIVED,
        SOCKET_EVENTS.MEDIA_UPLOAD_PROGRESS,
        SOCKET_EVENTS.MEDIA_UPLOAD_COMPLETE,
        SOCKET_EVENTS.MEDIA_UPLOAD_ERROR
    ],
    FRIENDS: [
        SOCKET_EVENTS.FRIEND_REQUEST_SENT,
        SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED,
        SOCKET_EVENTS.FRIEND_REQUEST_REJECTED,
        SOCKET_EVENTS.FRIEND_REQUEST_CANCELLED,
        SOCKET_EVENTS.FRIEND_REMOVED
    ],
    GROUPS: [
        SOCKET_EVENTS.CREATE_GROUP,
        SOCKET_EVENTS.JOIN_GROUP,
        SOCKET_EVENTS.LEAVE_GROUP,
        SOCKET_EVENTS.GROUP_DELETED,
        SOCKET_EVENTS.GROUP_UPDATED,
        SOCKET_EVENTS.SEND_GROUP_MESSAGE,
        SOCKET_EVENTS.GROUP_MESSAGE_RECEIVED
    ],
    NOTIFICATIONS: [
        SOCKET_EVENTS.NEW_NOTIFICATION,
        SOCKET_EVENTS.NOTIFICATION_READ,
        SOCKET_EVENTS.CLEAR_NOTIFICATIONS
    ],
    STATUS: [
        SOCKET_EVENTS.ONLINE_STATUS,
        SOCKET_EVENTS.USER_PRESENCE_CHANGED,
        SOCKET_EVENTS.LAST_SEEN_UPDATED
    ],
    ERRORS: [
        SOCKET_EVENTS.ERROR,
        SOCKET_EVENTS.VALIDATION_ERROR,
        SOCKET_EVENTS.AUTHORIZATION_ERROR
    ]
};

// Utility function to get events by category
export const getEventsByCategory = (category) => EVENT_CATEGORIES[category] || [];