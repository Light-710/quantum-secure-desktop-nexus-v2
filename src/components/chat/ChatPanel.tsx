
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from './types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';

const ChatPanel = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Alex Thompson',
      content: 'Team, I need an update on the web application security testing. How is it going?',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      senderRole: 'Manager'
    },
    {
      id: '2',
      sender: 'Sarah Chen',
      content: 'I\'ve completed the initial reconnaissance phase. Found several potential entry points in the login system.',
      timestamp: new Date(Date.now() - 82800000), // 23 hours ago
      senderRole: 'Employee'
    },
    {
      id: '3',
      sender: 'James Wilson',
      content: 'My SQL injection tests revealed a vulnerability in the search functionality. I\'ll document it in the report.',
      timestamp: new Date(Date.now() - 43200000), // 12 hours ago
      senderRole: 'Employee'
    },
    {
      id: '4',
      sender: 'Alex Thompson',
      content: 'Good findings. Anyone working on the API endpoints?',
      timestamp: new Date(Date.now() - 21600000), // 6 hours ago
      senderRole: 'Manager'
    },
    {
      id: '5',
      sender: 'Sarah Chen',
      content: 'Yes, I\'m starting on that now. Will upload my methodology document soon.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      senderRole: 'Employee'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: user?.name || 'Current User',
        content: newMessage,
        timestamp: new Date(),
        senderRole: user?.role as 'Employee' | 'Manager' || 'Employee'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileMessage: Message = {
        id: `file-${Date.now()}`,
        sender: user?.name || 'Current User',
        content: `📎 Shared a file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
        timestamp: new Date(),
        senderRole: user?.role as 'Employee' | 'Manager' || 'Employee'
      };
      setMessages([...messages, fileMessage]);
      // Here you would typically upload the file to a server
      console.log('File selected for upload:', file);
    }
  };

  return (
    <Card className="h-full glass-panel border-cyber-teal/30">
      <CardHeader>
        <CardTitle className="text-xl text-cyber-teal flex items-center gap-2">
          <MessageCircle className="text-cyber-blue" size={20} />
          Project Security Testing Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-12rem)]">
        <ScrollArea className="flex-1 mb-4">
          <MessageList messages={messages} />
        </ScrollArea>
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleFileUpload={handleFileUpload}
        />
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
