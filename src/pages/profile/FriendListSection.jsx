import React from 'react';
import { UserCircle2, UserMinus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import axiosInstance from '../../lib/axios'

// FriendListItem Component
const FriendListItem = ({ friend, onRemoveFriend }) => {
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [isRemoving, setIsRemoving] = React.useState(false);

    const handleRemoveFriend = async () => {
        try {
            setIsRemoving(true);
            // Call the API to remove friend
            const response = await axiosInstance.delete(`/users/${friend._id}/remove`);

            if (!response.ok) throw new Error('Failed to remove friend');

            // Notify parent component
            onRemoveFriend(friend._id);
        } catch (error) {
            console.error('Error removing friend:', error);
        } finally {
            setIsRemoving(false);
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
            <div className="bg-black/40 backdrop-blur-sm text-white rounded-lg px-4 py-2 border border-white/10 hover:border-white/20 transition-all flex justify-between group">
                {/* Profile Section */}
                <div className="flex items-center space-x-4 cursor-pointer hover:opacity-90 transition-opacity">
                    <div className="bg-white/10 rounded-full p-2">
                        <UserCircle2 size={36} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg">{friend.name}</span>
                        <span className="text-sm text-gray-400">@{friend.username}</span>
                    </div>
                </div>

                {/* Action Section */}
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-100 hover:text-red-500 hover:bg-red-500/10 opacity-100 group-hover:opacity-100 transition-all"
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={isRemoving}
                    >
                        <UserMinus size={20} />
                    </Button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="bg-gray-900 text-white border border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">Remove Friend</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p className="text-white">
                                Are you sure you want to remove <span className="text-blue-400">@{friend.username}</span>?
                            </p>
                            <p className="text-sm text-gray-400">
                                This action cannot be undone and you'll need to send a new friend request to reconnect.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleRemoveFriend}
                            disabled={isRemoving}
                        >
                            {isRemoving ? 'Removing...' : 'Remove Friend'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

// FriendListSection Component
const FriendListSection = ({ friends, onFriendRemoved }) => {
    if (friends.length === 0) {
        return (
            <div className="text-center text-white flex flex-col items-center p-8">
                <UserCircle2 size={48} className="text-blue-400 mb-4" />
                <p className="text-gray-400">No friends to display</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {friends.map(friend => (
                <FriendListItem
                    key={friend._id}
                    friend={friend}
                    onRemoveFriend={onFriendRemoved}
                />
            ))}
        </div>
    );
};

export default FriendListSection;