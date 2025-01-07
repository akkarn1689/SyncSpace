import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ConversationListItem from './ConversationListItem';

const ConversationList = ({ conversations, activeConversation, onConversationSelect }) => {
   return (
       <Paper sx={{
           bgcolor: 'background.paper',
           color: 'common.white',
           minWidth: 280,
           width: '30%',
           borderRight: 1,
           borderColor: 'divider',
           display: 'flex',
           flexDirection: 'column',
           maxHeight: '100vh',
           '& ::-webkit-scrollbar': { width: 6 },
           '& ::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }
       }}>
           <Box sx={{
               px: 2,
               py: 1.6,
               borderBottom: 1,
               borderColor: 'divider',
               display: 'flex',
               alignItems: 'center',
               gap: 1
           }}>
               <MessageIcon />
               <Typography variant="h6" fontWeight="bold">Messages</Typography>
           </Box>
           
           <Box sx={{
               flexGrow: 1,
               overflow: 'auto',
               px: 1
           }}>
               {conversations?.map((conversation) => (
                   <ConversationListItem
                       key={conversation._id}
                       conversation={conversation}
                       isActive={activeConversation?._id === conversation._id}
                       onClick={onConversationSelect}
                   />
               ))}
           </Box>
       </Paper>
   );
};

export default ConversationList;