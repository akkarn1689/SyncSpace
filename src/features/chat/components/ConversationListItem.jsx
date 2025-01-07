import React from 'react';
import { Avatar, Box, Typography, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useAuth } from '../../auth/hooks/useAuth';

const ConversationListItem = ({ conversation, isActive, onClick }) => {
   const { user } = useAuth();
   const otherUser = conversation.users.find(u => u?._id !== user?._id);

   return (
       <ListItem
           onClick={() => onClick(conversation)}
           sx={{
               px: 1,
               py: 0.8,
               my: 0.5,
            //    mx: 0.1,
               borderRadius: 1,
            //    border: 1,
               borderColor: isActive ? 'primary.main' : 'divider',
               bgcolor: isActive ? 'action.selected' : 'background.paper',
               cursor: 'pointer',
               '&:hover': {
                   bgcolor: 'action.hover',
               },
               transition: 'all 0.2s ease-in-out'
           }}
       >
           <ListItemAvatar>
               <Avatar 
                   src={`https://ui-avatars.com/api/?name=${otherUser.name || otherUser.username}`}
                   alt={otherUser.name || otherUser.username}
               />
           </ListItemAvatar>
           <ListItemText
               primary={
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Typography variant="subtitle1" noWrap fontWeight="medium">
                           {otherUser.name}
                       </Typography>
                   </Box>
               }
            //    secondary={
            //        <Typography 
            //            variant="body2" 
            //            sx={{ 
            //                color: 'text.secondary',
            //                fontStyle: 'italic',
            //                mt: 0.5
            //            }} 
            //            noWrap
            //        >
            //            @{otherUser.username}
            //        </Typography>
            //    }
           />
       </ListItem>
   );
};

export default ConversationListItem;