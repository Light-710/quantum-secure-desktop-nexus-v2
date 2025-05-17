
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, Search, RefreshCw, Users, Calendar, Eye, Filter, Archive } from 'lucide-react';

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
  const { toast } = useToast();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For now, use sample data
      const sampleChats: ChatSession[] = [
        {
          id: 'CHA001',
          participants: ['Sarah Johnson', 'Michael Chen', 'Technical Support'],
          participantCount: 3,
          lastMessage: 'I'll check with the team and get back to you tomorrow.',
          lastActive: '2024-05-16T14:30:00Z',
          messageCount: 24,
          status: 'Active',
        },
        {
          id: 'CHA002',
          participants: ['Emily Rodriguez', 'Technical Support'],
          participantCount: 2,
          lastMessage: 'Thank you for your help!',
          lastActive: '2024-05-15T09:45:00Z',
          messageCount: 18,
          status: 'Closed',
        },
        {
          id: 'CHA003',
          participants: ['Alex Wu', 'David Kim', 'Network Team', 'Security Team'],
          participantCount: 4,
          lastMessage: 'We need to schedule a follow-up meeting to discuss this further.',
          lastActive: '2024-05-10T16:20:00Z',
          messageCount: 56,
          status: 'Archived',
        },
        {
          id: 'CHA004',
          participants: ['Olivia Smith', 'Desktop Support'],
          participantCount: 2,
          lastMessage: 'Your VPN access has been restored.',
          lastActive: '2024-05-17T10:15:00Z',
          messageCount: 12,
          status: 'Active',
        },
      ];
      
      setChatSessions(sampleChats);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // For now, use sample data
      const sampleMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'Sarah Johnson',
          content: 'Hi, I'm having trouble accessing the company VPN. Can someone help?',
          timestamp: '2024-05-16T14:10:00Z'
        },
        {
          id: '2',
          sender: 'Technical Support',
          content: 'Hi Sarah, I'd be happy to help. Can you tell me what error message you're seeing?',
          timestamp: '2024-05-16T14:12:00Z'
        },
        {
          id: '3',
          sender: 'Sarah Johnson',
          content: 'It says "Authentication Failed" even though I'm sure my password is correct.',
          timestamp: '2024-05-16T14:15:00Z'
        },
        {
          id: '4',
          sender: 'Michael Chen',
          content: 'This might be related to the security update we pushed yesterday. Let me check.',
          timestamp: '2024-05-16T14:18:00Z'
        },
        {
          id: '5',
          sender: 'Technical Support',
          content: 'Yes, that's likely the cause. We'll need to reset your security token.',
          timestamp: '2024-05-16T14:23:00Z'
        },
        {
          id: '6',
          sender: 'Sarah Johnson',
          content: 'Great, how long will that take?',
          timestamp: '2024-05-16T14:25:00Z'
        },
        {
          id: '7',
          sender: 'Michael Chen',
          content: 'I'll check with the team and get back to you tomorrow.',
          timestamp: '2024-05-16T14:30:00Z'
        }
      ];
      
      setChatMessages(sampleMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const handleRefresh = () => {
    fetchChatSessions();
    toast({
      title: "Refreshed",
      description: "Chat sessions have been updated.",
    });
  };

  const handleViewChat = (chatId: string) => {
    setSelectedChat(chatId);
    fetchChatMessages(chatId);
    setIsViewDialogOpen(true);
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
  const filteredChats = chatSessions.filter(chat => {
    const matchesSearch = searchTerm === '' || 
      chat.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      chat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || chat.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
                  filteredChats.map((chat) => (
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
              {chatSessions.filter(chat => chat.status === 'Active').length}
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
              {chatSessions.reduce((total, chat) => total + chat.participantCount, 0)}
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
              {chatSessions.reduce((total, chat) => total + chat.messageCount, 0)}
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
