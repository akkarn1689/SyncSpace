// FriendListSection.jsx
import React, { useState } from 'react';
import {
    Box, Avatar, Typography, IconButton, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { PersonRemove, AccountCircle } from '@mui/icons-material';
// import axiosInstance from '../../lib/axios';

const FriendListItem = ({ friend, onRemoveFriend }) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemoveFriend = async () => {
        try {
            setIsRemoving(true);
            const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/users/${friend._id}/remove`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove friend');
            }

            onRemoveFriend(friend._id);
        } catch (error) {
            console.error('Error removing friend:', error);
        } finally {
            setIsRemoving(false);
            setConfirmDialogOpen(false);
        }
    };

    return (
        <>
            <Card variant="outlined" sx={{ mb: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <AccountCircle />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1">{friend.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    @{friend.username}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={() => setConfirmDialogOpen(true)}
                            disabled={isRemoving}
                            color="error"
                        >
                            <PersonRemove />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Remove Friend</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove @{friend.username}?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone and you'll need to send a new friend request to reconnect.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleRemoveFriend}
                        disabled={isRemoving}
                        color="error"
                        variant="contained"
                    >
                        {isRemoving ? 'Removing...' : 'Remove Friend'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const FriendListSection = ({ friends, onFriendRemoved }) => {
    if (friends.length === 0) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                <AccountCircle sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography color="text.secondary">No friends to display</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {friends.map(friend => (
                <FriendListItem
                    key={friend._id}
                    friend={friend}
                    onRemoveFriend={onFriendRemoved}
                />
            ))}
        </Box>
    );
};

export default FriendListSection;