export const formatMessages = (messages, userId) => {
    return messages.map(msg => ({
        senderId: msg.sender?._id,
        text: msg.message,
        date: new Date(msg.timestamp)
    }));
};

export const formatConversations = (conversations, userId) => {
    return conversations.map(conv => {
        const otherUser = conv.users.find(u => u?._id !== userId);
        return {
            id: conv?._id,
            avatar: `https://ui-avatars.com/api/?name=${otherUser.name || otherUser.username}`,
            title: otherUser.name || otherUser.username,
            subtitle: otherUser.email,
            date: new Date(conv.createdAt)
        };
    });
};