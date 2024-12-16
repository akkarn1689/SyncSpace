// FriendRequestsSection.jsx
import React from 'react';
import FriendRequestItem from './FriendRequestItem';

const FriendRequestsSection = ({
    pendingRequests,
    sentRequests,
    onAccept,
    onDecline,
    isLoading
}) => {
    return (
        <div className="space-y-6">
            {/* Pending Requests Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Pending Requests</h3>
                {pendingRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No pending friend requests
                    </div>
                ) : (
                    <div className="space-y-3">
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
                    </div>
                )}
            </div>

            {/* Sent Requests Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Sent Requests</h3>
                {sentRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No sent friend requests
                    </div>
                ) : (
                    <div className="space-y-3">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequestsSection;