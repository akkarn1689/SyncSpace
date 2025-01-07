import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../auth/hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import { socketService } from '../../../services/socket/socketService';
import { SOCKET_EVENTS } from '../../../services/socket/socketEvents';
import ConversationHeader from './ConversationHeader';
import MessageContainer from './MessageContainer';
import ChatInput from './ChatInput';
import axiosInstance from '../../../lib/axios';

const ConversationChatRoom = ({ conversation }) => {
   const [messages, setMessages] = useState([]);
   const { user, token } = useAuth();
   const [hasMore, setHasMore] = useState(false);
   const [page, setPage] = useState(1);
   const [isTyping, setIsTyping] = useState(false);
   const [isSending, setIsSending] = useState(false);
   const { isConnected } = useSocket(token);

   const otherUser = conversation?.users.find(u => u?._id !== user?._id);

   const formatMessages = (messages) => {
       return messages?.map(msg => ({
           id: msg._id,
           senderId: msg.sender._id,
           text: msg.message,
           date: new Date(msg.timestamp),
           status: msg.status || 'sent'
       }));
   };

   const fetchMessages = async (conversationId, page) => {
       try {
           const response = await axiosInstance.get(
               `/messages/conversations/${conversationId}?page=${page}&limit=20`
           );
           return response.data;
       } catch (error) {
           console.error('Error fetching messages:', error);
           throw error;
       }
   };

   const handleIncomingMessage = useCallback((message) => {
       if (message.sender._id === otherUser?._id) {
           const newMessage = {
               id: message._id,
               senderId: message.sender._id,
               text: message.message,
               date: new Date(message.timestamp),
               status: 'received'
           };
           setMessages(prev => [...prev, newMessage]);

           socketService.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
               messageId: message._id,
               conversationId: conversation._id
           });
       }
   }, [otherUser?._id, conversation._id]);

   const handleMessageDelivered = useCallback((data) => {
       setMessages(prev => prev.map(msg =>
           msg.id === data.messageId
               ? { ...msg, status: 'delivered' }
               : msg
       ));
   }, []);

   const handleMessageRead = useCallback((data) => {
       setMessages(prev => prev.map(msg =>
           msg.id === data.messageId
               ? { ...msg, status: 'read' }
               : msg
       ));
   }, []);

   useEffect(() => {
       if (isConnected && conversation?._id) {
           socketService.on(SOCKET_EVENTS.CONVERSATION_MESSAGE_RECEIVED, handleIncomingMessage);
           socketService.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handleMessageDelivered);
           socketService.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);

           return () => {
               socketService.off(SOCKET_EVENTS.CONVERSATION_MESSAGE_RECEIVED, handleIncomingMessage);
               socketService.off(SOCKET_EVENTS.MESSAGE_DELIVERED, handleMessageDelivered);
               socketService.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
           };
       }
   }, [isConnected, conversation?._id, handleIncomingMessage, handleMessageDelivered, handleMessageRead]);

   useEffect(() => {
       const loadMessages = async () => {
           if (conversation._id) {
               try {
                   const { messages: newMessages, hasMore: moreMessages } = await fetchMessages(conversation._id, page);
                   const formattedMessages = formatMessages(newMessages, user?._id);
                   setMessages(prev => {
                       const uniqueMessages = formattedMessages.filter(
                           newMsg => !prev.some(
                               existingMsg =>
                                   existingMsg.text === newMsg.text &&
                                   existingMsg.senderId === newMsg.senderId &&
                                   existingMsg.date.getTime() === newMsg.date.getTime()
                           )
                       );
                       return page === 1 ? formattedMessages : [...prev, ...uniqueMessages];
                   });
                   setHasMore(moreMessages);
               } catch (error) {
                   console.error('Error loading messages:', error);
               }
           }
       };

       loadMessages();
   }, [conversation._id, page, user?._id]);

   const handleSendMessage = async (recipientId, messageText) => {
       if (!isConnected || !messageText.trim()) return;

       setIsSending(true);

       try {
           const tempMessage = {
               id: `temp-${Date.now()}`,
               senderId: user?._id,
               text: messageText,
               date: new Date(),
               status: 'sending'
           };

           setMessages(prev => [...prev, tempMessage]);

           await socketService.sendMessage(otherUser?._id, messageText)
               .then((response) => {
                   setMessages(prev => prev.map(msg =>
                       msg.id === tempMessage.id
                           ? {
                               id: response.messageId,
                               senderId: user?._id,
                               text: messageText,
                               date: new Date(response.timestamp),
                               status: 'sent'
                           }
                           : msg
                   ));
               })
               .catch((error) => {
                   setMessages(prev => prev.map(msg =>
                       msg.id === tempMessage.id
                           ? { ...msg, status: 'failed' }
                           : msg
                   ));
                   console.error('Failed to send message:', error);
               });
       } catch (error) {
           console.error('Error sending message:', error);
       } finally {
           setIsSending(false);
       }
   };

   const handleRetryMessage = async (messageId) => {
       const failedMessage = messages.find(msg => msg.id === messageId);
       if (failedMessage) {
           setMessages(prev => prev.filter(msg => msg.id !== messageId));
           await handleSendMessage(failedMessage.text);
       }
   };

   const loadMoreMessages = async () => {
       console.log('Loading more messages...');
   };

   return (
       <Box sx={{
           display: 'flex',
           flexDirection: 'column',
           height: '100%',
           marginLeft: 1,
           border: '1px solid',
           borderRadius: 1,
           borderColor: 'divider'
       }}>
           <ConversationHeader
               user={otherUser}
               isTyping={isTyping}
               isOnline={isConnected}
           />
           <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
               <MessageContainer
                   messages={messages}
                   userId={user?._id}
                   onLoadMore={loadMoreMessages}
                   hasMore={hasMore}
                   onRetryMessage={handleRetryMessage}
               />
           </Box>
           <ChatInput
               onSendMessage={handleSendMessage}
               recipientId={otherUser?._id}
               disabled={!isConnected || isSending}
               placeholder={!isConnected ? "Connecting..." : "Type a message..."}
           />
       </Box>
   );
};

export default ConversationChatRoom;