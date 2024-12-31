// NotificationPage.jsx
import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Tabs, Tab, 
  CircularProgress, styled 
} from '@mui/material';
import { useAuth } from '../../features/auth/hooks/useAuth';
import FriendRequestsSection from './FriendRequestsSection';
import { useFriendRequests } from '../../hooks/useFriendRequest';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[10],
  border: 'none',
  borderRadius: theme.shape.borderRadius * 2
}));

const NotificationPage = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  
  const {
    pendingRequests,
    sentRequests,
    actionLoading,
    handleAcceptRequest,
    handleDeclineRequest
  } = useFriendRequests(user);

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '4xl', mx: 'auto', p: 4 }}>
      <StyledCard>
        {/* <Box p={3}>
          <Typography variant="h5" component="h1">Notifications</Typography>
        </Box> */}

        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Friend Requests" value="requests" sx={{ color: 'white' }} />
          <Tab label="Notifications" value="notifications" sx={{ color: 'white' }} />
        </Tabs>

        {activeTab === 'requests' ? (
          <CardContent>
            <FriendRequestsSection 
              key="friendrequests"
              pendingRequests={pendingRequests}
              sentRequests={sentRequests}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
              isLoading={actionLoading}
            />
          </CardContent>
        ) : (
          <CardContent>
            <Box textAlign="center" py={4} color="text.secondary">
              Other notification part
            </Box>
          </CardContent>
        )}
      </StyledCard>
    </Box>
  );
};

export default NotificationPage;