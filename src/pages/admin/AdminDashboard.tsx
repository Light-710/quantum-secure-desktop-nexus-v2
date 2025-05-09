
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, Server, Activity, Database, Monitor, Settings, 
  BarChart3, Cpu, HardDrive, Network, Clock, Shield, 
  UserPlus, FileText, Check, AlertTriangle, Info
} from 'lucide-react';

// Empty User Type
type User = {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  lastLogin: string;
};

// Empty Log Type
type LogEntry = {
  id: string;
  level: string;
  event: string;
  user: string;
  timestamp: string;
};

// Empty VM Type
type VirtualMachine = {
  id: string;
  user: string;
  os: string;
  status: string;
  uptime: string;
  cpu: number;
  memory: number;
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
  
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0
  });
  
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [vmStatuses, setVmStatuses] = useState<VirtualMachine[]>([]);
  
  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isLoadingVMs, setIsLoadingVMs] = useState(true);
  
  // API fetch functions
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setUsers({
        active: [],
        inactive: []
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
  
  const fetchSystemMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setSystemMetrics({
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0
      });
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load system metrics",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMetrics(false);
    }
  };
  
  const fetchRecentLogs = async () => {
    setIsLoadingLogs(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setRecentLogs([]);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  const fetchVirtualMachines = async () => {
    setIsLoadingVMs(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setVmStatuses([]);
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
  
  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchSystemMetrics();
    fetchRecentLogs();
    fetchVirtualMachines();
  }, []);
  
  // VM action handler with data refresh
  const handleVmAction = async (vmId: string, action: string) => {
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      toast({
        title: `VM ${action} Initiated`,
        description: `Virtual desktop ${vmId} ${action.toLowerCase()} command sent.`,
      });
      
      // Refresh VM data after action
      fetchVirtualMachines();
    } catch (error) {
      console.error(`Error performing VM ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} the virtual machine`,
        variant: "destructive",
      });
    }
  };
  
  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "The user creation form would open here.",
    });
  };
  
  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-cyber-teal">Admin Dashboard - Full System Access</CardTitle>
          <CardDescription className="text-cyber-gray">
            Complete control over users, virtual desktops, and system settings
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* CPU */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-blue/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">CPU Usage</p>
                {isLoadingMetrics ? (
                  <Skeleton className="h-9 w-16 bg-cyber-blue/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-cyber-blue mt-1">{systemMetrics.cpu}%</h3>
                )}
              </div>
              <div className="bg-cyber-blue/10 p-3 rounded-full">
                <Cpu className="h-6 w-6 text-cyber-blue" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              {isLoadingMetrics ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full bg-cyber-blue" style={{ width: `${systemMetrics.cpu}%` }}></div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Memory */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-green/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">Memory Usage</p>
                {isLoadingMetrics ? (
                  <Skeleton className="h-9 w-16 bg-cyber-green/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-cyber-green mt-1">{systemMetrics.memory}%</h3>
                )}
              </div>
              <div className="bg-cyber-green/10 p-3 rounded-full">
                <HardDrive className="h-6 w-6 text-cyber-green" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              {isLoadingMetrics ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full bg-cyber-green" style={{ width: `${systemMetrics.memory}%` }}></div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Storage */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-teal/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">Storage Usage</p>
                {isLoadingMetrics ? (
                  <Skeleton className="h-9 w-16 bg-cyber-teal/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-cyber-teal mt-1">{systemMetrics.storage}%</h3>
                )}
              </div>
              <div className="bg-cyber-teal/10 p-3 rounded-full">
                <Database className="h-6 w-6 text-cyber-teal" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              {isLoadingMetrics ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full bg-cyber-teal" style={{ width: `${systemMetrics.storage}%` }}></div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Network */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-purple-400/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">Network Load</p>
                {isLoadingMetrics ? (
                  <Skeleton className="h-9 w-16 bg-purple-400/10" />
                ) : (
                  <h3 className="text-3xl font-bold text-purple-400 mt-1">{systemMetrics.network}%</h3>
                )}
              </div>
              <div className="bg-purple-400/10 p-3 rounded-full">
                <Network className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              {isLoadingMetrics ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full bg-purple-400" style={{ width: `${systemMetrics.network}%` }}></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Management and Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User Management */}
        <div className="lg:col-span-2">
          <Card className="glass-panel border-cyber-teal/30 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-cyber-teal flex items-center">
                  <Users className="mr-2 text-cyber-blue" size={20} />
                  User Management
                </CardTitle>
                <CardDescription className="text-cyber-gray">
                  Manage system users and their roles
                </CardDescription>
              </div>
              
              <Button className="cyber-button" onClick={handleAddUser}>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full bg-cyber-dark-blue/20" />
                  <Skeleton className="h-16 w-full bg-cyber-dark-blue/20" />
                  <Skeleton className="h-16 w-full bg-cyber-dark-blue/20" />
                </div>
              ) : (
                <Tabs defaultValue="active" onValueChange={(value) => setActiveUserTab(value)}>
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-cyber-dark-blue/50">
                    <TabsTrigger value="active" className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue">
                      Active Users
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue">
                      Inactive Users
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="space-y-4">
                    {users.active.length > 0 ? (
                      users.active.map((user) => (
                        <div key={user.id} className="flex items-center justify-between border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-cyber-dark-blue flex items-center justify-center text-cyber-teal border border-cyber-teal/30">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-cyber-teal">{user.name}</p>
                              <div className="flex space-x-4 mt-1">
                                <span className="text-xs text-cyber-gray">ID: {user.id}</span>
                                <span className={`text-xs ${
                                  user.role === 'Admin' 
                                    ? 'text-cyber-red' 
                                    : user.role === 'Manager' 
                                      ? 'text-cyber-green' 
                                      : 'text-cyber-blue'
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              user.status === 'Online' 
                                ? 'bg-green-400/20 text-green-400' 
                                : user.status === 'Away' 
                                  ? 'bg-yellow-400/20 text-yellow-400' 
                                  : 'bg-cyber-gray/20 text-cyber-gray'
                            }`}>
                              {user.status}
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                              >
                                <Settings size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-cyber-gray">
                        No active users found
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="inactive" className="space-y-4">
                    {users.inactive.length > 0 ? (
                      users.inactive.map((user) => (
                        <div key={user.id} className="flex items-center justify-between border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-cyber-dark-blue flex items-center justify-center text-cyber-gray border border-cyber-teal/30 opacity-70">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-cyber-gray">{user.name}</p>
                              <div className="flex space-x-4 mt-1">
                                <span className="text-xs text-cyber-gray">ID: {user.id}</span>
                                <span className="text-xs text-cyber-gray">{user.role}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-xs px-2 py-1 rounded-full bg-cyber-red/20 text-cyber-red">
                              {user.status}
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                              >
                                <Check size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-cyber-gray">
                        No inactive users found
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Activity Logs */}
        <div>
          <Card className="glass-panel border-cyber-teal/30 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-teal flex items-center">
                <Activity className="mr-2 text-cyber-blue" size={20} />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-cyber-gray">
                System and user activity logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoadingLogs ? (
                  <>
                    <Skeleton className="h-12 w-full bg-cyber-dark-blue/20" />
                    <Skeleton className="h-12 w-full bg-cyber-dark-blue/20" />
                    <Skeleton className="h-12 w-full bg-cyber-dark-blue/20" />
                  </>
                ) : recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="border border-cyber-teal/20 rounded-md p-2 bg-cyber-dark-blue/20">
                      <div className="flex items-start space-x-2">
                        <div className="mt-0.5">
                          {log.level === 'Warning' ? (
                            <AlertTriangle size={16} className="text-yellow-400" />
                          ) : log.level === 'Error' ? (
                            <AlertTriangle size={16} className="text-cyber-red" />
                          ) : (
                            <Info size={16} className="text-cyber-blue" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-cyber-teal font-medium">{log.event}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-cyber-gray">{log.user}</span>
                            <span className="text-xs text-cyber-gray opacity-70">{log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-cyber-gray">
                    No recent activity
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue mt-2"
                  onClick={() => navigate('/dashboard/admin/logs')}
                >
                  View All Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Virtual Desktop Management */}
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-cyber-teal flex items-center">
            <Monitor className="mr-2 text-cyber-blue" size={20} />
            Virtual Desktop Management
          </CardTitle>
          <CardDescription className="text-cyber-gray">
            Monitor and control virtual desktop instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-cyber-dark-blue/40">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">VM ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">OS</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">Uptime</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">CPU</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-cyber-teal">Memory</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-cyber-teal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingVMs ? (
                  <tr>
                    <td colSpan={8} className="py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin h-8 w-8 border-2 border-cyber-teal border-t-transparent rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ) : vmStatuses.length > 0 ? (
                  vmStatuses.map((vm) => (
                    <tr key={vm.id} className="hover:bg-cyber-dark-blue/20">
                      <td className="py-3 px-4 text-sm text-cyber-teal">{vm.id}</td>
                      <td className="py-3 px-4 text-sm text-cyber-gray">{vm.user}</td>
                      <td className="py-3 px-4 text-sm text-cyber-gray">
                        {vm.os === 'Windows' ? (
                          <span className="text-blue-400">{vm.os}</span>
                        ) : (
                          <span className="text-yellow-400">{vm.os}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          vm.status === 'Running' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-cyber-gray/20 text-cyber-gray'
                        }`}>
                          {vm.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-cyber-gray">
                        <Clock size={14} className="inline mr-1" />
                        {vm.uptime}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-cyber-dark-blue rounded-full h-2">
                            <div 
                              className="bg-cyber-blue rounded-full h-2" 
                              style={{ width: `${vm.cpu}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyber-blue">{vm.cpu}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-cyber-dark-blue rounded-full h-2">
                            <div 
                              className="bg-cyber-green rounded-full h-2" 
                              style={{ width: `${vm.memory}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyber-green">{vm.memory}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-1">
                          {vm.status === 'Running' ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                                onClick={() => handleVmAction(vm.id, 'Stop')}
                              >
                                Stop
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                              >
                                Connect
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                              onClick={() => handleVmAction(vm.id, 'Start')}
                            >
                              Start
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-cyber-gray">
                      No virtual machines found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* System Health */}
      <Card className="glass-panel border-cyber-teal/30">
        <CardHeader>
          <CardTitle className="text-xl text-cyber-teal flex items-center">
            <Shield className="mr-2 text-cyber-blue" size={20} />
            System Security Health
          </CardTitle>
          <CardDescription className="text-cyber-gray">
            Current security status and recent scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Security Score */}
            <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
              <h4 className="text-sm text-cyber-gray">Security Score</h4>
              <div className="flex items-end justify-between mt-2">
                {isLoadingMetrics ? (
                  <Skeleton className="h-8 w-16 bg-cyber-blue/10" />
                ) : (
                  <div className="text-3xl font-semibold text-cyber-blue">0<span className="text-xl">/100</span></div>
                )}
                <div className="text-xs text-cyber-gray">Not Available</div>
              </div>
              <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                {isLoadingMetrics ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <div className="h-full bg-cyber-blue" style={{ width: '0%' }}></div>
                )}
              </div>
              <p className="mt-2 text-xs text-cyber-gray">Last scan: Not available</p>
            </div>
            
            {/* Vulnerabilities */}
            <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
              <h4 className="text-sm text-cyber-gray">Active Vulnerabilities</h4>
              <div className="flex items-end justify-between mt-2">
                {isLoadingMetrics ? (
                  <Skeleton className="h-8 w-8 bg-cyber-blue/10" />
                ) : (
                  <div className="text-3xl font-semibold text-cyber-green">0</div>
                )}
                <div className="text-xs text-cyber-gray">Not Available</div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-gray">Critical</span>
                  <span className="text-cyber-red">0</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-gray">High</span>
                  <span className="text-yellow-400">0</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-gray">Medium</span>
                  <span className="text-cyber-green">0</span>
                </div>
              </div>
            </div>
            
            {/* Backup Status */}
            <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
              <h4 className="text-sm text-cyber-gray">Backup Status</h4>
              <div className="flex items-end justify-between mt-2">
                {isLoadingMetrics ? (
                  <Skeleton className="h-6 w-24 bg-cyber-blue/10" />
                ) : (
                  <div className="text-xl font-semibold text-cyber-teal">Not Available</div>
                )}
                <div className="text-xs text-yellow-400">
                  No Data
                </div>
              </div>
              <p className="mt-2 text-xs text-cyber-gray">Last backup: Not available</p>
              <p className="text-xs text-cyber-gray">Next backup: Not configured</p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs w-full border-cyber-teal/30 hover:bg-cyber-teal/20 hover:text-cyber-teal"
                  onClick={() => navigate('/dashboard/admin/system')}
                >
                  Configure Backup
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
