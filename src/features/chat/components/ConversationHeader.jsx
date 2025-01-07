import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const ConversationHeader = ({ user }) => {
   const initials = user?.name?.split(' ').map(n => n[0]).join('') || 
       user?.username?.[0] || '?';

   return (
       <Box sx={{
           px: 2,
           py: 1,
        //    ml: 0.5,
           borderBottom: 1,
           bgcolor: 'background.paper',
           color: 'common.white',
           display: 'flex',
           alignItems: 'center',
           gap: 2
       }}>
           <Avatar 
               src={`https://ui-avatars.com/api/?name=${user?.name || user?.username}`}
               alt={initials}
           >
               {initials}
           </Avatar>
           <Box>
               <Typography variant="subtitle1" fontWeight="600">
                   {user ? (user.name || user.username) : 'Loading...'}
               </Typography>
               {/* {user?.email && (
                   <Typography variant="body2" color="text.secondary">
                       {user.email}
                   </Typography>
               )} */}
           </Box>
       </Box>
   );
};

export default ConversationHeader;