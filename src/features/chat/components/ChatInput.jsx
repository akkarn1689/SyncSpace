import React from 'react';
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { FileUp, Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, recipientId }) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && recipientId) {
      try {
        onSendMessage(recipientId, message);
        setMessage('');
      } catch (error) {
        console.error('Message send error:', error);
        // Optionally show a toast or error message
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0 bg-black"
      >
        <FileUp className="h-4 w-4" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;