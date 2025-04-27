
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProjectSelect from './ProjectSelect';
import { Message } from './types';
import { Project } from '@/types/project';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';

// Sample project-specific messages
const projectMessages: Record<string, Message[]> = {
  'PR001': [
    {
      id: '1',
      sender: 'Alex Thompson',
      content: 'Team, I need an update on the web application security testing. How is it going?',
      timestamp: new Date(Date.now() - 86400000),
      senderRole: 'Manager'
    },
    {
      id: '2',
      sender: 'Sarah Chen',
      content: 'I\'ve completed the initial reconnaissance phase. Found several potential entry points in the login system.',
      timestamp: new Date(Date.now() - 82800000),
      senderRole: 'Employee'
    }
  ],
  'PR003': [
    {
      id: '3',
      sender: 'James Wilson',
      content: 'Starting the network vulnerability scan now. Will report findings by EOD.',
      timestamp: new Date(Date.now() - 43200000),
      senderRole: 'Employee'
    }
  ]
};

const ChatPanel = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Sample projects data
  const projects: Project[] = [
    { id: 'PR001', name: 'Web Application Penetration Test', status: 'In Progress', dueDate: '2025-05-10' },
    { id: 'PR003', name: 'Network Vulnerability Scan', status: 'Pending', dueDate: '2025-05-15' },
  ];

  useEffect(() => {
    if (selectedProject) {
      setMessages(projectMessages[selectedProject] || []);
    }
  }, [selectedProject]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
      const message: Message = {
        id: Date.now().toString(),
        sender: user?.name || 'Current User',
        content: newMessage,
        timestamp: new Date(),
        senderRole: user?.role as 'Employee' | 'Manager' || 'Employee'
      };
      
      // Update both the local state and the project messages
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      projectMessages[selectedProject] = updatedMessages;
      setNewMessage('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && selectedProject) {
      const file = event.target.files[0];
      const fileMessage: Message = {
        id: `file-${Date.now()}`,
        sender: user?.name || 'Current User',
        content: `📎 Shared a file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
        timestamp: new Date(),
        senderRole: user?.role as 'Employee' | 'Manager' || 'Employee'
      };
      const updatedMessages = [...messages, fileMessage];
      setMessages(updatedMessages);
      projectMessages[selectedProject] = updatedMessages;
    }
  };

  return (
    <Card className="h-full glass-panel border-warm-100/30">
      <CardHeader>
        <CardTitle className="text-xl text-warm-300 flex items-center gap-2">
          <MessageCircle className="text-warm-200" size={20} />
          Project Chat
        </CardTitle>
        <div className="mt-4">
          <ProjectSelect
            projects={projects}
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-16rem)]">
        {selectedProject ? (
          <>
            <ScrollArea className="flex-1 mb-4">
              <MessageList messages={messages} />
            </ScrollArea>
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleFileUpload={handleFileUpload}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-warm-100/70">
            Select a project to start chatting
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
