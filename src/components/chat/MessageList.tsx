
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from './types';
import { format } from 'date-fns';
import { FileText, Info, Download } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  // Ensure messages is always an array
  const messageArray = Array.isArray(messages) ? messages : [];

  // Sort messages chronologically - oldest first
  const sortedMessages = [...messageArray].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Extract filename from file_path
  const getFilename = (filePath: string): string => {
    // Extract the filename from the path
    return filePath.split('/').pop() || 'file';
  };

  return (
    <div className="space-y-4 pb-4">
      {sortedMessages.length > 0 ? (
        sortedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.isStatusMessage 
                ? 'bg-warm-50 justify-center' 
                : message.senderRole === 'Manager' 
                  ? 'bg-warm-50/50' 
                  : ''
            } p-3 rounded-lg animate-in fade-in-50`}
          >
            {message.isStatusMessage ? (
              <div className="flex items-center text-warm-200 text-sm">
                <Info size={14} className="mr-2" />
                <span className="font-medium">{message.sender}</span>
                <span className="mx-1">{message.content}</span>
                <span className="text-xs opacity-70">
                  {format(message.timestamp, 'h:mm a')}
                </span>
              </div>
            ) : (
              <>
                <Avatar className={`h-8 w-8 ${
                  message.senderRole === 'Manager' ? 'border border-secondary/40' : ''
                }`}>
                  <AvatarFallback className={`${
                    message.senderRole === 'Manager' 
                      ? 'bg-secondary/20 text-secondary' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {message.sender[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      message.senderRole === 'Manager' ? 'text-secondary' : 'text-primary'
                    }`}>
                      {message.sender}
                    </span>
                    <span className="text-xs text-warm-200">
                      {format(message.timestamp, 'h:mm a')}
                    </span>
                    {message.senderRole === 'Manager' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-secondary/20 text-secondary">
                        Manager
                      </span>
                    )}
                    {message.senderRole === 'Admin' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-destructive/20 text-destructive">
                        Admin
                      </span>
                    )}
                  </div>
                  {message.is_file ? (
                    <div className="mt-1 flex items-center justify-between bg-muted/30 p-2 rounded-md">
                      <div className="flex items-center gap-2 text-primary">
                        <FileText size={16} />
                        <span>{message.content}</span>
                      </div>
                      <a 
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/chat/download/${message.project_id}/${getFilename(message.file_path || '')}`}
                        download={getFilename(message.file_path || '')}
                        className="ml-4 p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                        title="Download file"
                      >
                        <Download size={16} className="text-primary" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-foreground mt-1">{message.content}</p>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="text-center p-6 text-warm-200">
          No messages yet. Start the conversation!
        </div>
      )}
    </div>
  );
};

export default MessageList;
