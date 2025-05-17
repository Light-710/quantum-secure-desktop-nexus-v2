
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { toast } from '@/components/ui/sonner';
import { MessageCircle, Search, RefreshCw, Users, Calendar, Eye, Filter, Archive } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

type ChatSession = {
  id: string;
  participants: string[];
  participantCount: number;
  lastMessage: string;
  lastActive: string;
  messageCount: number;
  status: 'Active' | 'Closed' | 'Archived';
};

type ChatMessage = {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
};

const AdminChats = () => {
  const { toast: uiToast } = useToast();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Fetch chat sessions using React Query
  const { 
    data: chatSessions = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/chat/sessions');
        return response.data;
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
        toast.error("Failed to load chat sessions", {
          description: "There was an error loading chat sessions. Please try again."
        });
        return [];
      }
    }
  });

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/admin/chat/messages/${chatId}`);
      setChatMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast.error("Failed to load chat messages", {
        description: "There was an error loading chat messages. Please try again."
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Chat sessions refreshed", {
      description: "Chat sessions have been updated."
    });
  };

  const handleViewChat = (chatId: string) => {
    setSelectedChat(chatId);
    fetchChatMessages(chatId);
    setIsViewDialogOpen(true);
  };

  const handleArchiveChat = async (chatId: string) => {
    try {
      await api.put(`/admin/chat/archive/${chatId}`);
      refetch();
      toast.success("Chat archived", {
        description: "The chat session has been archived successfully."
      });
    } catch (error) {
      console.error('Error archiving chat:', error);
      toast.error("Failed to archive chat", {
        description: "There was an error archiving the chat session. Please try again."
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Closed':
        return 'bg-gray-500 text-white';
      case 'Archived':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  // Filter chats based on search term and status filter
  const filteredChats = chatSessions.filter((chat: ChatSession) => {
    const matchesSearch = searchTerm === '' || 
      chat.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      chat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || chat.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for the summary cards
  const activeChats = chatSessions.filter((chat: ChatSession) => chat.status === 'Active').length;
  const totalParticipants = chatSessions.reduce((total: number, chat: ChatSession) => total + chat.participantCount, 0);
  const totalMessages = chatSessions.reduce((total: number, chat: ChatSession) => total + chat.messageCount, 0);

  return (
    <DashboardLayout>
      <Card className="glass-panel border-[#D6D2C9] mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#3E3D3A]">
              <MessageCircle className="inline-block mr-2 text-[#C47D5F]" />
              Chat Management
            </CardTitle>
            <CardDescription className="text-[#8E8B85]">
              Monitor and manage all support and team chat conversations
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8E8B85]" />
                <Input
                  placeholder="Search chats..."
                  className="pl-8 border-[#D6D2C9]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-[#8E8B85]" />
                <select
                  className="h-10 px-3 py-2 rounded-md border border-[#D6D2C9] bg-white text-[#3E3D3A]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border border-[#D6D2C9] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F7F5F2]">
                <TableRow>
                  <TableHead className="text-[#8E8B85]">Chat ID</TableHead>
                  <TableHead className="text-[#8E8B85]">Participants</TableHead>
                  <TableHead className="text-[#8E8B85]">Last Message</TableHead>
                  <TableHead className="text-[#8E8B85]">Last Active</TableHead>
                  <TableHead className="text-[#8E8B85]">Messages</TableHead>
                  <TableHead className="text-[#8E8B85]">Status</TableHead>
                  <TableHead className="text-[#8E8B85]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin h-6 w-6 border-2 border-[#C47D5F] border-t-transparent rounded-full mr-2"></div>
                        <span className="text-[#8E8B85]">Loading chats...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredChats.length > 0 ? (
                  filteredChats.map((chat: ChatSession) => (
                    <TableRow key={chat.id} className="hover:bg-[#F7F5F2]">
                      <TableCell className="font-mono text-sm text-[#8E8B85]">{chat.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-[#8E8B85]" />
                          <span className="text-sm text-[#3E3D3A]">
                            {chat.participants.slice(0, 2).join(', ')}
                            {chat.participants.length > 2 && ` +${chat.participants.length - 2} more`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-[#3E3D3A] truncate">{chat.lastMessage}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-[#8E8B85]">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="text-xs">{new Date(chat.lastActive).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#3E3D3A]">{chat.messageCount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(chat.status)}`}>
                          {chat.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
                            onClick={() => handleViewChat(chat.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {chat.status === 'Active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-blue-600"
                              onClick={() => handleArchiveChat(chat.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-[#8E8B85]">
                      No chat sessions match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">Active Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#8A9B6E]">
              {activeChats}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Ongoing conversations</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6D98BA]">
              {totalParticipants}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Users engaged in chats</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C47D5F]">
              {totalMessages}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Messages exchanged</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#3E3D3A]">Chat Session {selectedChat}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4 border border-[#D6D2C9] rounded-md bg-[#F7F5F2]/50">
            {chatMessages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-[#3E3D3A]">{message.sender}</span>
                  <span className="text-xs text-[#8E8B85] ml-2">{formatTimestamp(message.timestamp)}</span>
                </div>
                <div className="pl-2 border-l-2 border-[#D6D2C9] text-[#3E3D3A]">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline"
              className="border-[#D6D2C9] hover:bg-[#F7F5F2] mr-2"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminChats;
