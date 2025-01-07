import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { socketService } from '../services/socket/socketService';
import { SOCKET_EVENTS } from '../services/socket/socketEvents';

export const useFriendRequests = (user) => {
    const { toast } = useToast();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Initialize with user's existing requests
        setPendingRequests(user?.pendingFriendRequests || []);
        setSentRequests(user?.sentFriendRequests || []);

        // Handle incoming friend request
        const handleFriendRequestReceived = (data) => {
            setPendingRequests(prev => [...prev, {
                requestId: data.requestId,
                sender: data.sender
            }]);
            
            toast({
                title: "New Friend Request",
                description: `${data.sender.username} sent you a friend request`,
            });
        };

        // Handle when someone accepts your friend request
        const handleFriendRequestAccepted = (data) => {
            setSentRequests(prev => prev.filter(request => request.requestId !== data.requestId));
            
            toast({
                title: "Friend Request Accepted",
                description: `${data.sender.username} accepted your friend request`,
            });
        };

        // Handle when someone rejects your friend request
        const handleFriendRequestRejected = (data) => {
            setSentRequests(prev => prev.filter(request => request.requestId !== data.requestId));
            
            toast({
                title: "Friend Request Rejected",
                description: `${data.sender.username} rejected your friend request`,
            });
        };

        // Handle errors
        const handleError = (error) => {
            toast({
                title: "Error",
                description: error.message || "An error occurred",
                variant: "destructive",
            });
        };

        // Set up socket event listeners
        socketService.on(SOCKET_EVENTS.FRIEND_REQUEST_RECEIVED, handleFriendRequestReceived);
        socketService.on(SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED, handleFriendRequestAccepted);
        socketService.on(SOCKET_EVENTS.FRIEND_REQUEST_REJECTED, handleFriendRequestRejected);
        socketService.on(SOCKET_EVENTS.ERROR, handleError);

        // Cleanup function
        return () => {
            socketService.off(SOCKET_EVENTS.FRIEND_REQUEST_RECEIVED, handleFriendRequestReceived);
            socketService.off(SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED, handleFriendRequestAccepted);
            socketService.off(SOCKET_EVENTS.FRIEND_REQUEST_REJECTED, handleFriendRequestRejected);
            socketService.off(SOCKET_EVENTS.ERROR, handleError);
        };
    }, [user]);

    // const sendFriendRequest = async (recipientId) => {
    //     try {
    //         setActionLoading(true);
            
    //         if (!socketService.isConnected()) {
    //             throw new Error('Socket is not connected');
    //         }

    //         socketService.sendFriendRequest(recipientId);
            
    //         setSentRequests(prev => [...prev, {
    //             recipientId,
    //             status: 'pending'
    //         }]);

    //         toast({
    //             title: "Success",
    //             description: "Friend request sent successfully",
    //         });
    //     } catch (error) {
    //         toast({
    //             title: "Error",
    //             description: error.message || "Failed to send friend request",
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setActionLoading(false);
    //     }
    // };

    const handleAcceptRequest = async (requestId) => {
        try {
            console.log("In handle accept request: ", requestId);
            setActionLoading(true);
            
            if (!socketService.isConnected()) {
                throw new Error('Socket is not connected');
            }

            socketService.acceptFriendRequest(requestId);
            
            // Remove from pending requests immediately for better UX
            setPendingRequests(prev => 
                prev.filter(request => request._id !== requestId)
            );

            toast({
                title: "Success",
                description: "Friend request accepted",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to accept request",
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            setActionLoading(true);
            
            if (!socketService.isConnected()) {
                throw new Error('Socket is not connected');
            }

            socketService.rejectFriendRequest(requestId);
            
            // Remove from pending requests immediately for better UX
            setPendingRequests(prev => 
                prev.filter(request => request.requestId !== requestId)
            );

            toast({
                title: "Success",
                description: "Friend request declined",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to decline request",
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    };

    return {
        pendingRequests,
        sentRequests,
        actionLoading,
        // sendFriendRequest,
        handleAcceptRequest,
        handleDeclineRequest
    };
};