
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.senderRole === 'Manager' ? 'bg-cyber-dark-blue/20' : ''
          } p-3 rounded-lg`}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-cyber-dark-blue text-cyber-teal">
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
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-cyber-gray mt-1">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
