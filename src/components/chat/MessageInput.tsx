
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, SendHorizontalIcon } from "lucide-react";

type MessageInputProps = {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
};

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleFileUpload,
  isLoading = false
}: MessageInputProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full hover:bg-warm-700/10"
        onClick={() => fileInputRef.current?.click()}
      >
        <PaperclipIcon className="h-5 w-5 text-warm-200" />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </Button>
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 focus:ring-warm-200 focus:border-warm-200"
        disabled={isLoading}
      />
      <Button
        type="button"
        size="icon"
        className="rounded-full bg-warm-300 hover:bg-warm-300/90"
        onClick={handleSendMessage}
        disabled={!newMessage.trim() || isLoading}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-warm-100 border-t-transparent" />
        ) : (
          <SendHorizontalIcon className="h-5 w-5 text-dark" />
        )}
      </Button>
    </div>
  );
};

export default MessageInput;
