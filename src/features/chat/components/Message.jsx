import React, { memo, useState, forwardRef } from 'react';
import { 
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Box,
  styled
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import zIndex from '@mui/material/styles/zIndex';

// Styled components for custom message bubble effects
const MessageBubble = styled(Paper)(({ theme, isOutgoing }) => ({
  position: 'relative',
  maxWidth: '70%',
  padding: theme.spacing(0.2, 1),
  backgroundColor: isOutgoing ? theme.palette.grey[900] : theme.palette.grey[900],
  color: isOutgoing ? theme.palette.common.white : theme.palette.common.white,
  borderRadius: theme.spacing(1.5),
  [isOutgoing ? 'borderTopRightRadius' : 'borderTopLeftRadius']: theme.spacing(0.05),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  // '&::before': {
  //   content: '""',
  //   position: '',
  //   top: 0,
  //   zIndex: 0,
  //   [isOutgoing ? 'right' : 'left']: 0,
  //   width: theme.spacing(2),
  //   height: theme.spacing(2),
  //   backgroundColor: isOutgoing ? theme.palette.success.light : theme.palette.grey[900],
  //   transform: `translate(${isOutgoing ? '0%' : '0%'}, -0%) rotate(90deg)`,
  // }
}));

const MessageContainer = styled(Box)(({ theme, isOutgoing }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 2),
  justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
  '& .MuiIconButton-root': {
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
  },
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  }
}));

const Message = memo(forwardRef(({
  message,
  isOutgoing,
  onCopy,
  onDelete,
  onForward,
  onReply
}, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const messageActions = [
    { label: 'Reply', onClick: () => { onReply?.(message); handleClose(); } },
    { label: 'Forward', onClick: () => { onForward?.(message); handleClose(); } },
    { label: 'Copy', onClick: () => { onCopy?.(message.text); handleClose(); } },
    { 
      label: 'Delete', 
      onClick: () => { onDelete?.(message); handleClose(); },
      sx: { color: 'error.main' }
    }
  ];

  const formattedTime = new Date(message.date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <MessageContainer
      ref={ref}
      isOutgoing={isOutgoing}
      role="article"
      aria-label={`Message sent ${isOutgoing ? 'by you' : 'to you'} at ${formattedTime}`}
    >
      {/* Message Options Menu */}
      {isOutgoing ? (
        <IconButton
          size="small"
          onClick={handleClick}
          aria-label="Message options"
          aria-controls={open ? 'message-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ) : null}

      {/* Message Bubble */}
      <MessageBubble isOutgoing={isOutgoing} elevation={1}>
        <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          {message.text}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          // gap: 0.1, 
          // mt: 0.1 
        }}>
          <Typography
            variant="caption"
            component="time"
            dateTime={message.date}
            sx={{ opacity: 0.8 }}
          >
            {formattedTime}
          </Typography>
          
          {isOutgoing && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {message.status === 'sent' && <DoneIcon sx={{ fontSize: 12, opacity: 0.8 }} />}
              {message.status === 'delivered' && <DoneAllIcon sx={{ fontSize: 12, opacity: 0.8 }} />}
            </Box>
          )}
        </Box>
      </MessageBubble>

      {/* Message Options Menu for incoming messages */}
      {!isOutgoing ? (
        <IconButton
          size="small"
          onClick={handleClick}
          aria-label="Message options"
          aria-controls={open ? 'message-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ) : null}

      {/* Dropdown Menu */}
      <Menu
        id="message-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: isOutgoing ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isOutgoing ? 'right' : 'left',
        }}
      >
        {messageActions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={action.onClick}
            sx={action.sx}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </MessageContainer>
  );
}));

Message.displayName = 'Message';

export default Message;