import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";

const ConversationHeader = ({ user }) => {
    const initials = user?.name?.split(' ').map(n => n[0]).join('') ||
        user?.username?.[0] || '?';

    return (
        <div className="px-4 py-2 border-b bg-black text-white flex justify-start items-center gap-3">
            <Avatar>
                <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${user?.name || user?.username}`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold">
                    {user ? (user.name || user.username) : 'Loading...'}
                </h2>
                {user?.email && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                )}
            </div>
        </div>
    );
};

export default ConversationHeader;