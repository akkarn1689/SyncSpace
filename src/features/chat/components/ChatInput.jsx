import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { AttachFile as FileUpIcon, Send as SendIcon } from '@mui/icons-material';

const ChatInput = ({ onSendMessage, recipientId }) => {
 const [message, setMessage] = useState('');

 const handleSubmit = (e) => {
   e.preventDefault();
   if (message.trim() && recipientId) {
     try {
       onSendMessage(recipientId, message);
       setMessage('');
     } catch (error) {
       console.error('Message send error:', error);
     }
   }
 };

 return (
   <Box
     component="form"
     onSubmit={handleSubmit}
     sx={{
       px: 1.5,
       py: 1,
       borderTop: 1,
       borderColor: 'divider',
       display: 'flex',
       gap: 0.5
     }}
   >
     <IconButton type="button" sx={{ bgcolor: 'background.paper' }}>
       <FileUpIcon fontSize="small" />
     </IconButton>

     <TextField
       value={message}
       onChange={(e) => setMessage(e.target.value)}
       placeholder="Type a message..."
       fullWidth
       size="small"
       variant="outlined"
     />

     <IconButton type="submit" color="primary">
       <SendIcon fontSize="small" />
     </IconButton>
   </Box>
 );
};

export default ChatInput;