// hooks/useFriendRequests.js
import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import axios from '../lib/axios';

export const useFriendRequests = (user) => {
    const { toast } = useToast();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Here you would typically fetch the full request details including user info
                setPendingRequests(user?.pendingFriendRequests || []);
                setSentRequests(user?.sentFriendRequests || []);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load friend requests",
                    variant: "destructive",
                });
            }
        };

        if (user) {
            fetchRequests();
        }
    }, [user]);

    const handleAcceptRequest = async (requesterId) => {
        try {
            setActionLoading(true);
            const response = await axios.patch(`/users/${requesterId}/accept`);

            if (!response.ok) throw new Error('Failed to accept request');

            setPendingRequests(prev => prev.filter(id => id !== requesterId));

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

    const handleDeclineRequest = async (requesterId) => {
        try {
            setActionLoading(true);
            const response = await fetch(`/users/${requesterId}/decline`);

            if (!response.ok) throw new Error('Failed to decline request');

            setPendingRequests(prev => prev.filter(id => id !== requesterId));

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
        handleAcceptRequest,
        handleDeclineRequest
    };
};