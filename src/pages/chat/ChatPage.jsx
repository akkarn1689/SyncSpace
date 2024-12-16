import React, {useState, useEffect} from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import ConversationList from '@/src/features/chat/components/ConversationList';
import ConversationChatRoom from '@/src/features/chat/components/ChatRoom';
import axios from '../../lib/axios'
// import { fetchConversations } from '../../services/chatService';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const { user } = useAuth();

  const fetchConversation = async (conversationId) => {
    try {
      const response = await axios.get(`/conversations/${conversationId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/conversations');
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  };

  const formatConversations = (conversations, userId) => {
    return conversations?.map(conv => {
      const otherUser = conv.users.find(u => u._id !== userId);
      return {
        id: conv._id,
        avatar: `https://ui-avatars.com/api/?name=${otherUser.name || otherUser.username}`,
        title: otherUser.name || otherUser.username,
        subtitle: otherUser.email,
        date: new Date(conv.createdAt)
      };
    });
  };

  useEffect(() => {
    const loadConversations = async () => {
      const data = await fetchConversations();
      // const formattedConversations = formatConversations(data.conversations, user?._id);
      setConversations(data.conversations);
    };

    loadConversations();
  }, []);

  return (
    <div className="flex justify-center border-2 rounded-md px-2  min-h-[80vh] max-h-[80vh] bg-black text-white w-[90vw]">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
      />
      <div className="flex-1">
        {activeConversation ? (
          <ConversationChatRoom conversation={activeConversation} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;