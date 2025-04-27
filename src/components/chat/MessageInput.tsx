
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage,
  handleFileUpload 
}: MessageInputProps) => {
  return (
    <div className="flex gap-2 items-center bg-white/5 p-2 rounded-md border border-warm-100/30">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer p-2 rounded-full hover:bg-warm-100/10 transition-colors"
        title="Upload file"
      >
        <Paperclip className="h-5 w-5 text-warm-300" />
      </label>
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-white/5 border-warm-100/30"
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <Button
        onClick={handleSendMessage}
        className="bg-warm-300 hover:bg-warm-200 text-white"
        size="icon"
        disabled={!newMessage.trim()}
        title="Send message"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
