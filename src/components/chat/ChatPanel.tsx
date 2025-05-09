
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

const ChatPanel = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // In a real app, this would fetch projects from an API
    const fetchProjects = async () => {
      try {
        // API call would go here
        setProjects([]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // In a real app, this would fetch messages for the selected project
      const fetchMessages = async () => {
        try {
          // API call would go here
          setMessages([]);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      
      fetchMessages();
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
      
      // In a real app, this would send the message to an API
      setMessages(prev => [...prev, message]);
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
      
      // In a real app, this would upload the file to an API
      setMessages(prev => [...prev, fileMessage]);
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
