import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useAuth } from '../../features/auth/hooks/useAuth';
import ConversationList from '@/src/features/chat/components/ConversationList';
import ConversationChatRoom from '@/src/features/chat/components/ChatRoom';
// import axiosInstance from '../../lib/axios';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  minHeight: '80vh',
  maxHeight: '80vh',
  // width: '90vw',
  backgroundColor: 'inherit',
  color: theme.palette.common.white,
  // border: `2px solid ${theme.palette.divider}`,
  // borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1)
}));

const EmptyStateContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const { user } = useAuth();

  const fetchConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversations/${conversationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch conversations');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  };

  const formatConversations = (conversations, userId) => {
    return conversations?.map(conv => ({
      id: conv._id,
      avatar: `https://ui-avatars.com/api/?name=${conv.users.find(u => u._id !== userId).name || conv.users.find(u => u._id !== userId).username}`,
      title: conv.users.find(u => u._id !== userId).name || conv.users.find(u => u._id !== userId).username,
      subtitle: conv.users.find(u => u._id !== userId).email,
      date: new Date(conv.createdAt)
    }));
  };

  useEffect(() => {
    const loadConversations = async () => {
      const data = await fetchConversations();
      setConversations(data.conversations);
    };

    loadConversations();
  }, []);

  return (
    <ChatContainer>
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
      />
      <Box flex={1}>
        {activeConversation ? (
          <ConversationChatRoom conversation={activeConversation} />
        ) : (
          <EmptyStateContainer>
            <Typography variant="body1" color="text.secondary">
              Select a conversation to start chatting
            </Typography>
          </EmptyStateContainer>
        )}
      </Box>
    </ChatContainer>
  );
};

export default ChatPage;