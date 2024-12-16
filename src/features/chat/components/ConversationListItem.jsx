import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from '../../auth/hooks/useAuth';

const ConversationListItem = ({ conversation, isActive, onClick }) => {
    // const initials = conversation.title?.split(' ').map(n => n[0]).join('') || '?';
    const { user } = useAuth();
    console.log(`User: `, user);

    const otherUser = conversation.users.find(u => u?._id !== user?._id);
    console.log('otherUser: ', otherUser);

    console.log(`Conversation: `, conversation);
    return (
        <div
            onClick={() => onClick(conversation)}
            className={cn(
                "px-4 py-2 flex items-center gap-3 cursor-pointer border-2 rounded-md mx-2 my-1 bg-black text-white border-b-2 hover:bg-gray-00 transition-colors",
                isActive && "bg-gray-700"
            )}
        >
            <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?name=${otherUser.name || otherUser.username}`} />
                <AvatarFallback>{otherUser.name || otherUser.username}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{otherUser.name}</h3>
                    {/* <span className="text-xs text-gray-500">
                        {conversation?.createdAt?.toLocaleTimeString()}
                    </span> */}
                </div>
                <div className="flex justify-between items-start">
                    <h3 className="font-small italic text-gray-400 truncate">{otherUser.username}</h3>
                    {/* <span className="text-xs text-gray-500">
                        {conversation?.createdAt?.toLocaleTimeString()}
                    </span> */}
                </div>
                {/* <p className="text-sm text-gray-500 truncate">
                    {otherUser.username}
                </p> */}
            </div>
        </div>
    );
};

export default ConversationListItem;