
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from './types';

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hi team, how is the testing going?',
      timestamp: new Date(),
      senderRole: 'Manager'
    },
    {
      id: '2',
      sender: 'Alice Smith',
      content: 'Making good progress on the web application scan.',
      timestamp: new Date(),
      senderRole: 'Employee'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'Current User',
        content: newMessage,
        timestamp: new Date(),
        senderRole: 'Employee'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // File upload logic would go here
    console.log('File selected:', event.target.files?.[0]);
  };

  return (
    <Card className="h-full glass-panel border-cyber-teal/30">
      <CardHeader>
        <CardTitle className="text-xl text-cyber-teal flex items-center gap-2">
          <MessageCircle className="text-cyber-blue" size={20} />
          Project Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-12rem)]">
        <MessageList messages={messages} />
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
