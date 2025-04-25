
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Paperclip, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  senderRole: 'Employee' | 'Manager';
}

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
        
        <div className="flex gap-2 items-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer p-2 rounded-full hover:bg-cyber-dark-blue/20"
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
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
