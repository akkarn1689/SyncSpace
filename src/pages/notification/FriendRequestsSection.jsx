// FriendRequestsSection.jsx
import React from "react";
import FriendRequestItem from "./FriendRequestItem";
import { Box, Typography } from "@mui/material";

const FriendRequestsSection = ({
    pendingRequests,
    sentRequests,
    onAccept,
    onDecline,
    isLoading
}) => {
    const EmptyState = ({ message }) => (
        <Box textAlign="center" py={4} color="text.secondary">
            {message}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
                <Typography variant="h6" color="white" gutterBottom>
                    Pending Requests
                </Typography>
                {pendingRequests.length === 0 ? (
                    <EmptyState message="No pending friend requests" />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {pendingRequests.map((sender) => (
                            <FriendRequestItem
                                key={sender._id}
                                request={{
                                    _id: sender._id,
                                    name: sender.name || '',
                                    username: sender.username || '',
                                }}
                                type="received"
                                onAccept={onAccept}
                                onDecline={onDecline}
                                isLoading={isLoading}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Box>
                <Typography variant="h6" color="white" gutterBottom>
                    Sent Requests
                </Typography>
                {sentRequests.length === 0 ? (
                    <EmptyState message="No sent friend requests" />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {sentRequests.map((recipient) => (
                            <FriendRequestItem
                                key={recipient._id}
                                request={{
                                    _id: recipient._id,
                                    name: recipient?.name || '',
                                    username: recipient?.username || '',
                                }}
                                type="sent"
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default FriendRequestsSection;