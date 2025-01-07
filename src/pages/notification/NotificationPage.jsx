import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab,
  CircularProgress, styled
} from '@mui/material';
import { useAuth } from '../../features/auth/hooks/useAuth';
import FriendRequestsSection from './FriendRequestsSection';
import { useFriendRequests } from '../../hooks/useFriendRequest';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'inherit',
  color: theme.palette.common.white,
  boxShadow: 'none',
  border: 'none',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'visible'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
  padding: 1,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.common.white,
  borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.light,
  }
}));

const StyledCardContent = styled(CardContent)({
  background: 'inherit',
  '&:last-child': {
    paddingBottom: 24
  }
});

const NotificationPage = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');

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
        <StyledTabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <StyledTab label="Notifications" value="notifications" />
          <StyledTab label="Friend Requests" value="requests" />
        </StyledTabs>

        <StyledCardContent>
          {activeTab === 'requests' ? (
            <FriendRequestsSection
              key="friendrequests"
              pendingRequests={pendingRequests}
              sentRequests={sentRequests}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
              isLoading={actionLoading}
            />
          ) : (
            <Box textAlign="center" py={4} color="text.secondary">
              Notifications
            </Box>
          )}
        </StyledCardContent>
      </StyledCard>
    </Box>
  );
};

export default NotificationPage;