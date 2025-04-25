
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
    <div className="flex gap-2 items-center bg-cyber-dark-blue/20 p-2 rounded-md border border-cyber-teal/20">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer p-2 rounded-full hover:bg-cyber-dark-blue/20 transition-colors"
        title="Upload file"
      >
        <Paperclip className="h-5 w-5 text-cyber-teal" />
      </label>
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-cyber-dark-blue/20 border-cyber-teal/30"
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <Button
        onClick={handleSendMessage}
        className="cyber-button"
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
