// FriendRequestsSection.jsx (Parent Component)
import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import PendingRequestsSection from "./PendingRequestsSection";
import SentRequestsSection from "./SentRequestsSection";

const FriendRequestsSection = ({
    pendingRequests,
    sentRequests,
    onAccept,
    onDecline,
    onWithdraw,
    isLoading
}) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: isLargeScreen ? 'row' : 'column',
            justifyContent: 'space-between',
            gap: 1,
            alignItems: isLargeScreen ? 'flex-start' : 'stretch',
            width: '100%'
        }}>
            <Box sx={{ width: isLargeScreen ? '48%' : '100%' }}>
                <PendingRequestsSection
                    requests={pendingRequests}
                    onAccept={onAccept}
                    onDecline={onDecline}
                    isLoading={isLoading}
                />
            </Box>
            
            <Box sx={{ width: isLargeScreen ? '48%' : '100%' }}>
                <SentRequestsSection
                    requests={sentRequests}
                    onWithdraw={onWithdraw}
                    isLoading={isLoading}
                />
            </Box>
        </Box>
    );
};

export default FriendRequestsSection;