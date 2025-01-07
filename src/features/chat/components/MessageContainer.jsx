import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, CircularProgress, styled } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Message from './Message';

const ScrollArea = styled(Box)({
  height: '100%',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  }
});

const DateDivider = styled(Typography)(({ theme }) => ({
  background: "transparent",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  display: 'inline-block'
}));

const ScrollButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  minWidth: '40px',
  width: '40px',
  height: '40px',
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.grey[100]
  }
}));

const MessageContainer = ({
  messages,
  userId,
  onLoadMore = () => { },
  hasMoreMessages = false,
  isLoadingMore = false
}) => {
  const scrollViewportRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastMessageRef = useRef(null);
  const lastScrollPositionRef = useRef(0);

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) return "Today";
    if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return messageDate.toLocaleDateString();
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.date);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  const handleScroll = (event) => {
    const viewport = event.target;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);

    if (!isNearBottom) {
      const newMessages = messages.filter(
        msg => msg.timestamp > lastScrollPositionRef.current
      ).length;
      setUnreadCount(newMessages);
    } else {
      setUnreadCount(0);
      lastScrollPositionRef.current = new Date().getTime();
    }

    if (scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
      onLoadMore();
    }
  };

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setUnreadCount(0);
      lastScrollPositionRef.current = new Date().getTime();
    }
  };

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, userId]);

  return (
    <Box position="relative" height="100%" display="flex" flexDirection="column" sx={{mx: 0}}>
      <ScrollArea
        ref={scrollViewportRef}
        onScroll={handleScroll}
      >
        <Box display="flex" flexDirection="column" justifyContent="flex-end" minHeight="100%" p={2} sx={{ gap: 3 }}>
          {isLoadingMore && (
            <Box display="flex" justifyContent="center" py={1}>
              <CircularProgress size={20} />
            </Box>
          )}

          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <Box key={date} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" justifyContent="center">
                <DateDivider>{date}</DateDivider>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {dateMessages.map((message, index) => (
                  <Message
                    key={message.id || index}
                    message={message}
                    isOutgoing={message?.senderId === userId}
                    ref={index === dateMessages.length - 1 ? lastMessageRef : null}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </ScrollArea>

      {showScrollButton && (
        <Box
          position="absolute"
          bottom={16}
          right={16}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          {unreadCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                px: 1,
                py: 0.5,
                borderRadius: 'full',
              }}
            >
              {unreadCount} new messages
            </Typography>
          )}
          <ScrollButton
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <KeyboardArrowDownIcon />
          </ScrollButton>
        </Box>
      )}
    </Box>
  );
};

export default MessageContainer;