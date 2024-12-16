import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Button } from "@/src/components/ui/button";
import { ChevronDown } from "lucide-react";
import Message from './Message';

const MessageContainer = ({
    messages,
    userId,
    onLoadMore = () => { },
    hasMoreMessages = false,
    isLoadingMore = false
}) => {
    const scrollViewportRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const lastMessageRef = useRef(null);
    const lastScrollPositionRef = useRef(0);

    const formatDate = (date) => {
        // console.log('Date:', date);
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }
        return messageDate.toLocaleDateString();
    };

    const groupedMessages = messages.reduce((groups, message) => {
        // console.log('Message:', message);
        const date = formatDate(message.date);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    console.log('Goruped Messages:', groupedMessages);

    const handleScroll = (event) => {
        const viewport = event.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = viewport;

        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);

        if (!isNearBottom) {
            const newMessages = messages.filter(
                msg => msg.timestamp > lastScrollPositionRef.current
            ).length;
            setUnreadCount(newMessages);
        } else {
            setUnreadCount(0);
            lastScrollPositionRef.current = new Date().getTime();
        }

        if (scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
            onLoadMore();
        }
    };

    useEffect(() => {
        const viewport = scrollViewportRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            // const isNearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 100;

            viewport.scrollTop = viewport.scrollHeight;
            // if (isNearBottom) {
            //     viewport.scrollTo({
            //         top: viewport.scrollHeight,
            //         behavior: 'smooth'
            //     });
            //     setUnreadCount(0);
            //     lastScrollPositionRef.current = new Date().getTime();
            // }
        }
        // scrollToBottom();
    }, [messages, userId]);

    const scrollToBottom = () => {
        const viewport = scrollViewportRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth'
            });
            setUnreadCount(0);
            lastScrollPositionRef.current = new Date().getTime();
        }
    };

    return (
        <div className="relative h-full flex flex-col">
            <ScrollArea
                ref={scrollViewportRef}
                className="h-full"
                onScroll={handleScroll}
            >
                <div className="flex flex-col justify-end min-h-full p-4 space-y-6">
                    {isLoadingMore && (
                        <div className="text-center text-sm text-muted-foreground py-2">
                            Loading more messages...
                        </div>
                    )}

                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date} className="space-y-4">
                            <div className="flex justify-center">
                                <span className="bg-muted px-2 py-1 rounded-lg text-xs text-muted-foreground text-gray-800">
                                    {date}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {dateMessages.map((message, index) => (
                                    <Message
                                        key={message.id || index}
                                        message={message}
                                        isOutgoing={message?.senderId === userId}
                                        ref={index === dateMessages.length - 1 ? lastMessageRef : null}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {showScrollButton && (
                <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
                    {unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            {unreadCount} new messages
                        </span>
                    )}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-lg"
                        onClick={scrollToBottom}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MessageContainer;