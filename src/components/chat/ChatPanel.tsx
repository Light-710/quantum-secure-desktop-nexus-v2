
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProjectSelect from './ProjectSelect';
import { Message, ApiMessage, TypingIndicator, StatusMessage } from './types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import api from '@/services/api';
import { UserRole } from '@/types/user';
import socketService from '@/services/socketService';
import ConnectionStatus from './ConnectionStatus';
import TypingIndicatorComponent from './TypingIndicator';

const ChatPanel = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const messageListRef = useRef<Message[]>([]);
  const typingTimeoutRef = useRef<{[key: string]: NodeJS.Timeout}>({});
  const localMessageIds = useRef<Set<string>>(new Set()); // Track local message IDs

  // Update ref when messages change
  useEffect(() => {
    messageListRef.current = messages;
  }, [messages]);

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

  // Process API messages and update state
  useEffect(() => {
    if (!messagesData) return;
    
    // Handle both array format and object with messages property
    const messageArray = Array.isArray(messagesData) 
      ? messagesData 
      : messagesData.messages || [];
    
    if (!Array.isArray(messageArray)) {
      console.error('Expected messages to be an array but got:', messageArray);
      return;
    }
    
    const formattedMessages = messageArray.map((msg: ApiMessage) => {
      // Map API sender_role to a valid UserRole type
      const senderRole: UserRole = 
        (msg.sender_role === 'Manager' || msg.sender_role === 'Admin' || msg.sender_role === 'Tester') 
        ? msg.sender_role as UserRole 
        : 'Tester'; // Default to Tester if unknown
      
      return {
        id: msg.id || msg.message_id || `${Date.now()}-${Math.random()}`,
        sender: msg.sender_name || 'Unknown',
        content: msg.content || '',
        timestamp: new Date(msg.timestamp || Date.now()),
        senderRole: senderRole,
        is_file: msg.is_file || false,
        file_path: msg.file_path || ''
      };
    });

    setMessages(formattedMessages);
  }, [messagesData]);

  // Connect to WebSocket when project is selected
  useEffect(() => {
    if (!selectedProject || !user) return;
    
    const token = localStorage.getItem('ptng_token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    setIsConnecting(true);
    
    // Connect to WebSocket
    socketService.connect(token, {
      onConnect: () => {
        console.log('Socket connected');
        setIsSocketConnected(true);
        setIsConnecting(false);
        socketService.joinRoom(selectedProject);
      },
      onDisconnect: () => {
        console.log('Socket disconnected');
        setIsSocketConnected(false);
      },
      onMessage: (data) => {
        console.log('New message received', data);
        
        // Check if it's one of our own local messages by its ID
        const localMsgPrefix = `local-`;
        if (data.sender_id === user.employee_id && data.id && localMessageIds.current.has(`${localMsgPrefix}${data.id}`)) {
          // Replace the local optimistic message with the confirmed message
          localMessageIds.current.delete(`${localMsgPrefix}${data.id}`);
          
          setMessages(prevMessages => prevMessages.filter(msg => 
            msg.id !== `${localMsgPrefix}${data.id}`
          ));
        }
        
        // Check if we already have this message ID (avoid duplicates)
        const isDuplicate = messageListRef.current.some(msg => 
          (msg.id === data.id || msg.id === data.message_id)
        );
        
        if (!isDuplicate) {
          // Map API sender_role to a valid UserRole type
          const senderRole: UserRole = 
            (data.sender_role === 'Manager' || data.sender_role === 'Admin' || data.sender_role === 'Tester') 
            ? data.sender_role as UserRole 
            : 'Tester'; // Default to Tester if unknown
          
          const newMsg: Message = {
            id: data.id || data.message_id || `${Date.now()}-${Math.random()}`,
            sender: data.sender_name || 'Unknown',
            content: data.content || '',
            timestamp: new Date(data.timestamp || Date.now()),
            senderRole: senderRole,
            is_file: data.is_file || false,
            file_path: data.file_path || ''
          };
          
          setMessages(prevMessages => [...prevMessages, newMsg]);
        }
      },
      onStatus: (data: StatusMessage) => {
        // Add status message to the chat
        console.log('Status message received:', data);
        const statusMsg: Message = {
          id: `status-${Date.now()}`,
          sender: data.user || 'System',
          content: data.message,
          timestamp: new Date(data.timestamp || Date.now()),
          senderRole: 'Tester', // Use a neutral role for status messages
          isStatusMessage: true
        };
        
        setMessages(prevMessages => [...prevMessages, statusMsg]);
      },
      onTyping: (data) => {
        // Add user to typing indicators or reset their timeout
        setTypingUsers(prev => {
          const exists = prev.some(u => u.user === data.user);
          
          // Clear existing timeout if there is one
          if (typingTimeoutRef.current[data.user]) {
            clearTimeout(typingTimeoutRef.current[data.user]);
          }
          
          // Set a new timeout to remove this user after 3 seconds
          typingTimeoutRef.current[data.user] = setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u.user !== data.user));
          }, 3000);
          
          if (exists) {
            return prev.map(u => u.user === data.user ? {...u, timestamp: Date.now()} : u);
          } else {
            return [...prev, { user: data.user, timestamp: Date.now() }];
          }
        });
      },
      onStopTyping: (data) => {
        // Remove user from typing indicators
        setTypingUsers(prev => prev.filter(u => u.user !== data.user));
        
        // Clear timeout if it exists
        if (typingTimeoutRef.current[data.user]) {
          clearTimeout(typingTimeoutRef.current[data.user]);
          delete typingTimeoutRef.current[data.user];
        }
      },
      onError: (error) => {
        console.error('Socket error:', error);
        toast.error('Chat Error', {
          description: error.message || 'An error occurred with the chat connection'
        });
      }
    });
    
    // Cleanup function - disconnect from socket when component unmounts
    return () => {
      console.log('Leaving room', selectedProject);
      socketService.leaveRoom(selectedProject);
      
      // Clear all typing timeouts
      Object.values(typingTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      typingTimeoutRef.current = {};
      setTypingUsers([]);
      localMessageIds.current.clear();
    };
  }, [selectedProject, user]);

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
      // Create a unique ID for this message that we can track
      const messageId = Date.now().toString();
      const localMsgId = `local-${messageId}`;
      
      // Add local message ID to our tracking set
      localMessageIds.current.add(localMsgId);
      
      // Add optimistic message
      const optimisticMessage: Message = {
        id: localMsgId,
        sender: user?.name || 'You',
        content: newMessage,
        timestamp: new Date(),
        senderRole: user?.role as UserRole || 'Tester', 
        isLocal: true,
        status: 'sending'
      };
      
      // Only show optimistic message if using REST API
      const usingSocketIo = socketService.isConnected();
      
      if (!usingSocketIo) {
        setMessages(prev => [...prev, optimisticMessage]);
      }
      
      // Try to send through WebSocket first
      const socketSent = usingSocketIo && 
                        socketService.sendMessage(selectedProject, newMessage);
      
      // If socket fails or isn't connected, fall back to REST API
      if (!socketSent) {
        sendMessageMutation.mutate({
          projectId: selectedProject,
          content: newMessage
        });
      } else {
        setNewMessage(''); // Clear input right away if sent via socket
      }
      
      // Stop typing indicator
      handleTypingStop();
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
  
  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setMessages([]);
    setTypingUsers([]);
    localMessageIds.current.clear();
  };
  
  const handleTypingStart = () => {
    if (selectedProject && socketService.isConnected()) {
      socketService.sendTypingStart(selectedProject);
    }
  };
  
  const handleTypingStop = () => {
    if (selectedProject && socketService.isConnected()) {
      socketService.sendTypingStop(selectedProject);
    }
  };

  // Get typing users array for display
  const typingUserNames = typingUsers.map(t => t.user);

  return (
    <Card className="h-full glass-panel border-warm-100/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-warm-300 flex items-center gap-2">
          <MessageCircle className="text-warm-200" size={20} />
          Project Chat
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <div className="flex-1">
            <ProjectSelect
              projects={projects}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
          </div>
          {selectedProject && (
            <div className="ml-4">
              <ConnectionStatus 
                isConnected={isSocketConnected} 
                isConnecting={isConnecting} 
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-6rem)]">
        {selectedProject ? (
          <>
            <ScrollArea className="flex-1 mb-2 pr-2" ref={scrollAreaRef}>
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin h-8 w-8 border-2 border-warm-300 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <MessageList messages={messages} />
              )}
            </ScrollArea>
            {typingUsers.length > 0 && (
              <TypingIndicatorComponent typingUsers={typingUserNames} />
            )}
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleFileUpload={handleFileUpload}
              isLoading={sendMessageMutation.isPending || uploadFileMutation.isPending}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
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
