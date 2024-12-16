// NotificationPage.jsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../components/ui/tabs';
import { useAuth } from '../../features/auth/hooks/useAuth';
import FriendRequestsSection from './FriendRequestsSection';
import { useFriendRequests } from '../../hooks/useFriendRequest';

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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-black text-white shadow-2xl border-none">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>

                        <TabsContent value="requests">
                            <CardContent>
                                <FriendRequestsSection 
                                    key={"friendrequests"}
                                    pendingRequests={pendingRequests}
                                    sentRequests={sentRequests}
                                    onAccept={handleAcceptRequest}
                                    onDecline={handleDeclineRequest}
                                    isLoading={actionLoading}
                                />
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <CardContent>
                                <div className="text-center py-8 text-gray-400">
                                    Other notification part
                                </div>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default NotificationPage;