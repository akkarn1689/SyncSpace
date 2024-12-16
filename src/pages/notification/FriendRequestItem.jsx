// FriendRequestItem.jsx
import React from 'react';
import { Button } from '../../components/ui/button';
import { UserCircle2, Check, X, Send } from 'lucide-react';

const FriendRequestItem = ({ request, type, onAccept, onDecline, isLoading }) => {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <UserCircle2 size={32} className="text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">{request.name}</h3>
                    <p className="text-sm text-gray-400">@{request.username}</p>
                </div>
            </div>

            {type === 'received' ? (
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-500"
                        onClick={() => onAccept(request._id)}
                        disabled={isLoading}
                    >
                        <Check size={18} />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-500"
                        onClick={() => onDecline(request._id)}
                        disabled={isLoading}
                    >
                        <X size={18} />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <Send size={16} className="text-blue-400" />
                    <span className="text-sm text-gray-400">Sent</span>
                </div>
            )}
        </div>
    );
};

export default FriendRequestItem;
