
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from './types';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  // Ensure messages is always an array
  const messageArray = Array.isArray(messages) ? messages : [];

  return (
    <div className="space-y-4 pb-4">
      {messageArray.length > 0 ? (
        messageArray.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.senderRole === 'Manager' ? 'bg-cyber-dark-blue/20' : ''
            } p-3 rounded-lg animate-in fade-in-50`}
          >
            <Avatar className={`h-8 w-8 ${
              message.senderRole === 'Manager' ? 'border border-cyber-green/40' : ''
            }`}>
              <AvatarFallback className={`${
                message.senderRole === 'Manager' 
                  ? 'bg-cyber-dark-blue text-cyber-green' 
                  : 'bg-cyber-dark-blue text-cyber-blue'
              }`}>
                {message.sender[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  message.senderRole === 'Manager' ? 'text-cyber-green' : 'text-cyber-blue'
                }`}>
                  {message.sender}
                </span>
                <span className="text-xs text-cyber-gray">
                  {format(message.timestamp, 'h:mm a')}
                </span>
                {message.senderRole === 'Manager' && (
                  <span className="text-xs px-1.5 py-0.5 rounded-sm bg-cyber-green/20 text-cyber-green">
                    Manager
                  </span>
                )}
              </div>
              {message.is_file ? (
                <a 
                  href={message.file_path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cyber-blue hover:text-cyber-blue/80 mt-1"
                >
                  <FileText size={16} />
                  <span>{message.content}</span>
                </a>
              ) : (
                <p className="text-cyber-gray mt-1">{message.content}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 text-cyber-gray">
          No messages yet. Start the conversation!
        </div>
      )}
    </div>
  );
};

export default MessageList;
