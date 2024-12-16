import React, { memo, useState, forwardRef } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const Message = memo(
  forwardRef(({
    message,
    isOutgoing,
    onCopy,
    onDelete,
    onForward,
    onReply
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const messageActions = [
      { label: 'Reply', onClick: () => onReply?.(message) },
      { label: 'Forward', onClick: () => onForward?.(message) },
      { label: 'Copy', onClick: () => onCopy?.(message.text) },
      { label: 'Delete', onClick: () => onDelete?.(message), className: 'text-destructive' }
    ];

    const formattedTime = new Date(message.date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return (
      <div
        ref={ref}
        className={cn(
          "group flex items-end gap-2 mb-1 px-4 py-1",
          isOutgoing ? "justify-end" : "justify-start"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        aria-label={`Message sent ${isOutgoing ? 'by you' : 'to you'} at ${formattedTime}`}
      >
        {/* Message Options Dropdown */}
        <div className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "self-center",
          isOutgoing ? "order-first" : "order-last"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Message options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOutgoing ? "end" : "start"}>
              {messageActions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative max-w-[70%] py-2 px-4 shadow-sm",
            "transform transition-transform group-hover:scale-[1.05]",
            isOutgoing
              ? "bg-green-600 text-white rounded-2xl rounded-tr-sm"
              : "bg-gray-900 rounded-2xl rounded-tl-sm",
            "before:absolute before:top-0 before:w-4 before:h-0",
            isOutgoing
              ? "before:right-0 before:transform before:translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-green-600"
              : "before:left-0 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-gray-900"
          )}
        >
          <div className="relative">
            <p className="text-sm flex justify-start break-words whitespace-pre-wrap">
              {message.text}
            </p>
            <div className={cn(
              "flex justify-end items-start gap-0 mt-0",
              isOutgoing ? "text-gray-100" : "text-gray-500"
            )}>
              <time
                className="text-xs"
                dateTime={message.date}
              >
                {formattedTime}
              </time>
              {isOutgoing && (
                <span className="text-xs">
                
                {message.status==='sent' ? '✓': null}
                {message.status==='delivered' ? '✓✓': null}
                
                </span> // Add proper status icon
              )}
            </div>
          </div>
        </div>
      </div>
    );
  })
);

Message.displayName = 'Message';

export default Message;
