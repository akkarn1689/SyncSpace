import React from 'react';
import { ScrollArea } from "@/src/components/ui/scroll-area";
import ConversationListItem from './ConversationListItem';

const ConversationList = ({ conversations, activeConversation, onConversationSelect }) => {

    console.log(`Conversations in list: `, conversations);
    return (
        <div className="bg-black text-white min-w-72 w-[30%] border-r flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold">Messages</h1>
            </div>
            <ScrollArea className="flex-1">
                {conversations?.map((conversation) => (
                    <ConversationListItem
                        key={conversation._id}
                        conversation={conversation}
                        isActive={activeConversation?._id === conversation._id}
                        onClick={onConversationSelect}
                    />
                ))}
            </ScrollArea>
        </div>
    );
};

export default ConversationList;