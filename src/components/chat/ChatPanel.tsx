
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProjectSelect from './ProjectSelect';
import { Message, ApiMessage } from './types';
import { Project } from '@/types/project';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import api from '@/services/api';

const ChatPanel = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.employee_id],
    queryFn: async () => {
      try {
        const response = await api.get(`/project/get-projects`);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects', {
          description: 'Unable to load project list. Please try again later.'
        });
        return [];
      }
    }
  });

  // Fetch messages for selected project
  const { 
    data: messagesData, 
    refetch: refetchMessages,
    isLoading: isLoadingMessages
  } = useQuery({
    queryKey: ['messages', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return { messages: [] };
      
      try {
        const response = await api.get(`/chat/messages/${selectedProject}`);
        console.log('Messages response:', response.data);
        return response.data || { messages: [] };
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages', {
          description: 'Unable to load chat messages. Please try again later.'
        });
        return { messages: [] };
      }
    },
    enabled: !!selectedProject
  });

  // Prepare messages array from the response data
  const messages: Message[] = React.useMemo(() => {
    if (!messagesData) return [];
    
    // Handle both array format and object with messages property
    const messageArray = Array.isArray(messagesData) 
      ? messagesData 
      : messagesData.messages || [];
    
    if (!Array.isArray(messageArray)) {
      console.error('Expected messages to be an array but got:', messageArray);
      return [];
    }
    
    return messageArray.map((msg: ApiMessage) => ({
      id: msg.id || msg.message_id || Date.now() + Math.random(),
      sender: msg.sender_name || 'Unknown',
      content: msg.content || '',
      timestamp: new Date(msg.timestamp || Date.now()),
      senderRole: (msg.sender_role as UserRole) || 'Employee',
      is_file: msg.is_file || false,
      file_path: msg.file_path || ''
    }));
  }, [messagesData]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { projectId: string, content: string }) => {
      return api.post(`/chat/messages/${messageData.projectId}`, {
        content: messageData.content
      });
    },
    onSuccess: () => {
      setNewMessage('');
      refetchMessages();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message', {
        description: 'Your message could not be sent. Please try again.'
      });
    }
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post(`/chat/upload/${formData.get('projectId')}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      refetchMessages();
      toast.success('File uploaded', {
        description: 'Your file has been shared in the chat.'
      });
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file', {
        description: 'Your file could not be uploaded. Please try again.'
      });
    }
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
      sendMessageMutation.mutate({
        projectId: selectedProject,
        content: newMessage
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && selectedProject) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', selectedProject);
      
      uploadFileMutation.mutate(formData);
    }
  };

  return (
    <Card className="h-full glass-panel border-warm-100/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-warm-300 flex items-center gap-2">
          <MessageCircle className="text-warm-200" size={20} />
          Project Chat
        </CardTitle>
        <div className="mt-2">
          <ProjectSelect
            projects={projects}
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-6rem)]">
        {selectedProject ? (
          <>
            <ScrollArea className="flex-1 mb-4 pr-2" ref={scrollAreaRef}>
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin h-8 w-8 border-2 border-warm-300 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <MessageList messages={messages} />
              )}
            </ScrollArea>
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleFileUpload={handleFileUpload}
              isLoading={sendMessageMutation.isPending || uploadFileMutation.isPending}
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
