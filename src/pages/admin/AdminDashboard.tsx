
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, Server, Activity, Database, Monitor, Settings, 
  BarChart3, Cpu, HardDrive, Network, Clock, Shield, 
  UserPlus, FileText, Check, AlertTriangle, Info, Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeUserTab, setActiveUserTab] = useState('active');
  
  // Sample users data
  const users = {
    active: [
      { id: 'EMP001', name: 'John Employee', role: 'Employee', lastActive: '2025-04-25', status: 'Online' },
      { id: 'MGR001', name: 'Jane Manager', role: 'Manager', lastActive: '2025-04-25', status: 'Away' },
      { id: 'EMP002', name: 'Alice Tester', role: 'Employee', lastActive: '2025-04-24', status: 'Offline' },
      { id: 'EMP003', name: 'Mark Security', role: 'Employee', lastActive: '2025-04-25', status: 'Online' },
    ],
    inactive: [
      { id: 'EMP004', name: 'Sarah Analyst', role: 'Employee', lastActive: '2025-04-20', status: 'Disabled' },
      { id: 'EMP005', name: 'James Tester', role: 'Employee', lastActive: '2025-04-18', status: 'Disabled' },
    ]
  };
  
  // Sample system metrics
  const systemMetrics = {
    cpu: 42,
    memory: 56,
    storage: 68,
    network: 24
  };
  
  // Sample logs
  const recentLogs = [
    { id: 'LOG001', timestamp: '2025-04-25 09:32:15', event: 'User Login', user: 'EMP001', level: 'Info' },
    { id: 'LOG002', timestamp: '2025-04-25 08:45:22', event: 'VM Started', user: 'EMP003', level: 'Info' },
    { id: 'LOG003', timestamp: '2025-04-25 07:12:33', event: 'Failed Login Attempt', user: 'Unknown', level: 'Warning' },
    { id: 'LOG004', timestamp: '2025-04-25 06:55:10', event: 'System Backup Completed', user: 'System', level: 'Info' },
    { id: 'LOG005', timestamp: '2025-04-24 22:14:05', event: 'Resource Limit Warning', user: 'System', level: 'Warning' },
    { id: 'LOG006', timestamp: '2025-04-24 18:30:12', event: 'Security Scan Completed', user: 'System', level: 'Info' },
  ];
  
  // Sample VM statuses
  const vmStatuses = [
    { id: 'VM001', user: 'EMP001', os: 'Windows', status: 'Running', uptime: '8h 12m', cpu: 15, memory: 30 },
    { id: 'VM002', user: 'EMP001', os: 'Linux', status: 'Stopped', uptime: '0h 0m', cpu: 0, memory: 0 },
    { id: 'VM003', user: 'EMP003', os: 'Windows', status: 'Running', uptime: '2h 45m', cpu: 25, memory: 40 },
    { id: 'VM004', user: 'MGR001', os: 'Linux', status: 'Running', uptime: '4h 30m', cpu: 10, memory: 25 },
  ];
  
  const handleVmAction = (vmId: string, action: string) => {
    toast({
      title: `VM ${action} Initiated`,
      description: `Virtual desktop ${vmId} ${action.toLowerCase()} command sent.`,
    });
  };
  
  const handleAddUser = () => {
    toast({
      title: "Add User Feature",
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
                <h3 className="text-3xl font-bold text-cyber-blue mt-1">{systemMetrics.cpu}%</h3>
              </div>
              <div className="bg-cyber-blue/10 p-3 rounded-full">
                <Cpu className="h-6 w-6 text-cyber-blue" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              <div className="h-full bg-cyber-blue" style={{ width: `${systemMetrics.cpu}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Memory */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-green/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">Memory Usage</p>
                <h3 className="text-3xl font-bold text-cyber-green mt-1">{systemMetrics.memory}%</h3>
              </div>
              <div className="bg-cyber-green/10 p-3 rounded-full">
                <HardDrive className="h-6 w-6 text-cyber-green" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              <div className="h-full bg-cyber-green" style={{ width: `${systemMetrics.memory}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Storage */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-teal/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">Storage Usage</p>
                <h3 className="text-3xl font-bold text-cyber-teal mt-1">{systemMetrics.storage}%</h3>
              </div>
              <div className="bg-cyber-teal/10 p-3 rounded-full">
                <Database className="h-6 w-6 text-cyber-teal" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              <div className="h-full bg-cyber-teal" style={{ width: `${systemMetrics.storage}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Network */}
        <Card className="glass-panel border-cyber-teal/30 hover:border-purple-400/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyber-gray text-sm">Network Load</p>
                <h3 className="text-3xl font-bold text-purple-400 mt-1">{systemMetrics.network}%</h3>
              </div>
              <div className="bg-purple-400/10 p-3 rounded-full">
                <Network className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
              <div className="h-full bg-purple-400" style={{ width: `${systemMetrics.network}%` }}></div>
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
                  {users.active.map((user) => (
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
                  ))}
                </TabsContent>
                
                <TabsContent value="inactive" className="space-y-4">
                  {users.inactive.map((user) => (
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
                  ))}
                </TabsContent>
              </Tabs>
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
                {recentLogs.map((log) => (
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
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue mt-2"
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
              <tbody className="divide-y divide-cyber-teal/10">
                {vmStatuses.map((vm) => (
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
                ))}
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
                <div className="text-3xl font-semibold text-cyber-blue">95<span className="text-xl">/100</span></div>
                <div className="text-xs text-green-400">↑ 3 points</div>
              </div>
              <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                <div className="h-full bg-cyber-blue" style={{ width: '95%' }}></div>
              </div>
              <p className="mt-2 text-xs text-cyber-gray">Last scan: 4 hours ago</p>
            </div>
            
            {/* Vulnerabilities */}
            <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
              <h4 className="text-sm text-cyber-gray">Active Vulnerabilities</h4>
              <div className="flex items-end justify-between mt-2">
                <div className="text-3xl font-semibold text-cyber-green">2</div>
                <div className="text-xs text-green-400">↓ 5 from last scan</div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-gray">Critical</span>
                  <span className="text-cyber-red">0</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-gray">High</span>
                  <span className="text-yellow-400">1</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-gray">Medium</span>
                  <span className="text-cyber-blue">1</span>
                </div>
              </div>
            </div>
            
            {/* Backup Status */}
            <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
              <h4 className="text-sm text-cyber-gray">Backup Status</h4>
              <div className="flex items-end justify-between mt-2">
                <div className="text-xl font-semibold text-cyber-teal">Complete</div>
                <div className="text-xs text-green-400">
                  <Check size={16} className="inline" /> Verified
                </div>
              </div>
              <p className="mt-2 text-xs text-cyber-gray">Last backup: 2025-04-25 02:00 AM</p>
              <p className="text-xs text-cyber-gray">Next backup: 2025-04-26 02:00 AM</p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs w-full border-cyber-teal/30 hover:bg-cyber-teal/20 hover:text-cyber-teal"
                >
                  Start Manual Backup
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
