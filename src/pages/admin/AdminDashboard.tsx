
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, Monitor, Activity, MessageCircle,
  UserPlus, FolderOpen, RefreshCw
} from 'lucide-react';

// User Type
type User = {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  lastLogin: string;
};

// VM Type
type VirtualMachine = {
  id: string;
  user_name: string;
  instance_os: string;
  status: string;
  user_email: string;
};

// Project Type
type Project = {
  id: string;
  name: string;
  status: string;
  manager: string;
  teamSize: number;
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeUserTab, setActiveUserTab] = useState('active');
  
  // State variables with empty defaults
  const [users, setUsers] = useState<{
    active: User[];
    inactive: User[];
  }>({
    active: [],
    inactive: []
  });
  
  const [vms, setVms] = useState<VirtualMachine[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingVMs, setIsLoadingVMs] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  // API fetch functions
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const sampleActiveUsers: User[] = [
        {
          id: 'U001',
          name: 'John Smith',
          role: 'Employee',
          status: 'Online',
          email: 'john.smith@company.com',
          lastLogin: '2024-05-16T14:30:00Z',
        },
        {
          id: 'U002',
          name: 'Emily Chen',
          role: 'Manager',
          status: 'Away',
          email: 'emily.chen@company.com',
          lastLogin: '2024-05-16T10:15:00Z',
        },
        {
          id: 'U003',
          name: 'Michael Johnson',
          role: 'Tester',
          status: 'Online',
          email: 'michael.j@company.com',
          lastLogin: '2024-05-16T09:45:00Z',
        }
      ];
      
      const sampleInactiveUsers: User[] = [
        {
          id: 'U004',
          name: 'Sarah Williams',
          role: 'Employee',
          status: 'Disabled',
          email: 'sarah.w@company.com',
          lastLogin: '2024-05-10T11:20:00Z',
        }
      ];
      
      setUsers({
        active: sampleActiveUsers,
        inactive: sampleInactiveUsers
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchVirtualMachines = async () => {
    setIsLoadingVMs(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const sampleVMs: VirtualMachine[] = [
        {
          id: 'VM001',
          user_name: 'John Smith',
          instance_os: 'Windows',
          status: 'Running',
          user_email: 'john.smith@company.com',
        },
        {
          id: 'VM002',
          user_name: 'Emily Chen',
          instance_os: 'Linux',
          status: 'Stopped',
          user_email: 'emily.chen@company.com',
        },
        {
          id: 'VM003',
          user_name: 'Michael Johnson',
          instance_os: 'Windows',
          status: 'Running',
          user_email: 'michael.j@company.com',
        }
      ];
      
      setVms(sampleVMs);
    } catch (error) {
      console.error('Error fetching VM statuses:', error);
      toast({
        title: "Error",
        description: "Failed to load virtual machine data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVMs(false);
    }
  };
  
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const sampleProjects: Project[] = [
        {
          id: 'PRJ001',
          name: 'Cloud Migration',
          status: 'Active',
          manager: 'Emily Chen',
          teamSize: 6,
        },
        {
          id: 'PRJ002',
          name: 'Security Audit',
          status: 'Completed',
          manager: 'David Wilson',
          teamSize: 3,
        },
        {
          id: 'PRJ003',
          name: 'New CRM Implementation',
          status: 'On Hold',
          manager: 'Sarah Williams',
          teamSize: 8,
        }
      ];
      
      setProjects(sampleProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchVirtualMachines();
    fetchProjects();
  }, []);
  
  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "The user creation form would open here.",
    });
  };
  
  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <Card className="glass-panel border-[#D6D2C9] mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-[#3E3D3A]">Admin Dashboard</CardTitle>
          <CardDescription className="text-[#8E8B85]">
            Manage users, virtual desktops, and projects
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Users Card */}
        <Card className="glass-panel border-[#D6D2C9] hover:border-[#8A9B6E]/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8E8B85] text-sm">Total Users</p>
                {isLoadingUsers ? (
                  <Skeleton className="h-9 w-16 bg-[#8A9B6E]/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-[#8A9B6E] mt-1">
                    {users.active.length + users.inactive.length}
                  </h3>
                )}
              </div>
              <div className="bg-[#8A9B6E]/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-[#8A9B6E]" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline" 
                size="sm"
                className="w-full border-[#D6D2C9] hover:bg-[#F7F5F2]"
                onClick={() => navigate('/dashboard/admin/users')}
              >
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Projects Card */}
        <Card className="glass-panel border-[#D6D2C9] hover:border-[#C47D5F]/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8E8B85] text-sm">Active Projects</p>
                {isLoadingProjects ? (
                  <Skeleton className="h-9 w-16 bg-[#C47D5F]/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-[#C47D5F] mt-1">
                    {projects.filter(p => p.status === 'Active').length}
                  </h3>
                )}
              </div>
              <div className="bg-[#C47D5F]/10 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-[#C47D5F]" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline" 
                size="sm"
                className="w-full border-[#D6D2C9] hover:bg-[#F7F5F2]"
                onClick={() => navigate('/dashboard/admin/projects')}
              >
                View All Projects
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Virtual Desktops Card */}
        <Card className="glass-panel border-[#D6D2C9] hover:border-[#6D98BA]/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8E8B85] text-sm">Running VMs</p>
                {isLoadingVMs ? (
                  <Skeleton className="h-9 w-16 bg-[#6D98BA]/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-[#6D98BA] mt-1">
                    {vms.filter(vm => vm.status.toLowerCase() === 'running').length}
                  </h3>
                )}
              </div>
              <div className="bg-[#6D98BA]/10 p-3 rounded-full">
                <Monitor className="h-6 w-6 text-[#6D98BA]" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline" 
                size="sm"
                className="w-full border-[#D6D2C9] hover:bg-[#F7F5F2]"
                onClick={() => navigate('/dashboard/admin/virtual-desktops')}
              >
                View All VMs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Management Section */}
      <Card className="glass-panel border-[#D6D2C9] mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-[#3E3D3A] flex items-center">
              <Users className="mr-2 text-[#8A9B6E]" size={20} />
              User Management
            </CardTitle>
            <CardDescription className="text-[#8E8B85]">
              Manage system users and their roles
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-[#D6D2C9] hover:bg-[#F7F5F2]"
              onClick={() => fetchUsers()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button 
              className="bg-[#8A9B6E] hover:bg-[#798C5D] text-white"
              onClick={handleAddUser}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-[#F7F5F2]" />
              <Skeleton className="h-16 w-full bg-[#F7F5F2]" />
              <Skeleton className="h-16 w-full bg-[#F7F5F2]" />
            </div>
          ) : (
            <Tabs defaultValue="active" onValueChange={(value) => setActiveUserTab(value)}>
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#F7F5F2]">
                <TabsTrigger value="active" className="data-[state=active]:bg-[#8A9B6E]/20 data-[state=active]:text-[#8A9B6E]">
                  Active Users ({users.active.length})
                </TabsTrigger>
                <TabsTrigger value="inactive" className="data-[state=active]:bg-[#8A9B6E]/20 data-[state=active]:text-[#8A9B6E]">
                  Inactive Users ({users.inactive.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {users.active.length > 0 ? (
                  users.active.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border border-[#D6D2C9] rounded-md p-3 bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center text-[#3E3D3A] border border-[#D6D2C9]">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#3E3D3A]">{user.name}</p>
                          <div className="flex space-x-4 mt-1">
                            <span className="text-xs text-[#8E8B85]">ID: {user.id}</span>
                            <span className={`text-xs ${
                              user.role === 'Admin' 
                                ? 'text-[#A84332]' 
                                : user.role === 'Manager' 
                                  ? 'text-[#8A9B6E]' 
                                  : user.role === 'Tester'
                                    ? 'text-[#C47D5F]'
                                    : 'text-[#6D98BA]'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'Online' 
                            ? 'bg-green-100 text-green-800' 
                            : user.status === 'Away' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#8E8B85]">
                    No active users found
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full border-[#D6D2C9] hover:bg-[#F7F5F2]"
                  onClick={() => navigate('/dashboard/admin/users')}
                >
                  View All Users
                </Button>
              </TabsContent>
              
              <TabsContent value="inactive" className="space-y-4">
                {users.inactive.length > 0 ? (
                  users.inactive.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border border-[#D6D2C9] rounded-md p-3 bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center text-[#8E8B85] border border-[#D6D2C9] opacity-70">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#8E8B85]">{user.name}</p>
                          <div className="flex space-x-4 mt-1">
                            <span className="text-xs text-[#8E8B85]">ID: {user.id}</span>
                            <span className="text-xs text-[#8E8B85]">{user.role}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          {user.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#8E8B85]">
                    No inactive users found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Virtual Desktop Management */}
      <Card className="glass-panel border-[#D6D2C9] mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-[#3E3D3A] flex items-center">
              <Monitor className="mr-2 text-[#6D98BA]" size={20} />
              Virtual Desktop Overview
            </CardTitle>
            <CardDescription className="text-[#8E8B85]">
              Monitor virtual desktop instances
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-[#D6D2C9] hover:bg-[#F7F5F2]"
              onClick={() => fetchVirtualMachines()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button 
              className="bg-[#6D98BA] hover:bg-[#5D88AA] text-white"
              onClick={() => navigate('/dashboard/admin/virtual-desktops')}
            >
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingVMs ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full bg-[#F7F5F2]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Running VMs counter */}
              <div className="border border-[#D6D2C9] rounded-md p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#8E8B85] text-sm">Running VMs</div>
                    <div className="text-3xl font-bold text-[#6D98BA] mt-1">
                      {vms.filter(vm => vm.status.toLowerCase() === 'running').length}
                    </div>
                  </div>
                  <div className="text-sm text-[#8E8B85]">
                    of {vms.length} total
                  </div>
                </div>
                <div className="mt-3 h-2 bg-[#F7F5F2] rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-[#6D98BA] rounded-full" 
                    style={{ 
                      width: `${vms.length > 0 ? (vms.filter(vm => vm.status.toLowerCase() === 'running').length / vms.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* OS Distribution */}
              <div className="border border-[#D6D2C9] rounded-md p-4 bg-white">
                <div className="text-[#8E8B85] text-sm">OS Distribution</div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-[#3E3D3A]">Windows</span>
                    </div>
                    <div className="text-xl font-semibold text-[#3E3D3A] mt-1">
                      {vms.filter(vm => vm.instance_os.toLowerCase() === 'windows').length}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-[#3E3D3A]">Linux</span>
                    </div>
                    <div className="text-xl font-semibold text-[#3E3D3A] mt-1">
                      {vms.filter(vm => vm.instance_os.toLowerCase() === 'linux').length}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm text-[#3E3D3A]">Other</span>
                    </div>
                    <div className="text-xl font-semibold text-[#3E3D3A] mt-1">
                      {vms.filter(vm => 
                        vm.instance_os.toLowerCase() !== 'windows' && 
                        vm.instance_os.toLowerCase() !== 'linux'
                      ).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Projects Overview */}
      <Card className="glass-panel border-[#D6D2C9]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-[#3E3D3A] flex items-center">
              <Activity className="mr-2 text-[#C47D5F]" size={20} />
              Projects Overview
            </CardTitle>
            <CardDescription className="text-[#8E8B85]">
              Project status summary
            </CardDescription>
          </div>
          <div>
            <Button 
              className="bg-[#C47D5F] hover:bg-[#B36F51] text-white"
              onClick={() => navigate('/dashboard/admin/projects')}
            >
              Manage Projects
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingProjects ? (
            <Skeleton className="h-24 w-full bg-[#F7F5F2]" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#D6D2C9] rounded-md p-4 bg-white">
                <div className="text-[#8E8B85] text-sm mb-2">Active</div>
                <div className="text-2xl font-bold text-[#8A9B6E]">
                  {projects.filter(p => p.status === 'Active').length}
                </div>
                <div className="text-xs text-[#8E8B85] mt-1">Projects in progress</div>
              </div>
              
              <div className="border border-[#D6D2C9] rounded-md p-4 bg-white">
                <div className="text-[#8E8B85] text-sm mb-2">Completed</div>
                <div className="text-2xl font-bold text-[#6D98BA]">
                  {projects.filter(p => p.status === 'Completed').length}
                </div>
                <div className="text-xs text-[#8E8B85] mt-1">Successfully delivered projects</div>
              </div>
              
              <div className="border border-[#D6D2C9] rounded-md p-4 bg-white">
                <div className="text-[#8E8B85] text-sm mb-2">On Hold/Issues</div>
                <div className="text-2xl font-bold text-[#C47D5F]">
                  {projects.filter(p => p.status === 'On Hold' || p.status === 'Cancelled').length}
                </div>
                <div className="text-xs text-[#8E8B85] mt-1">Projects requiring attention</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
