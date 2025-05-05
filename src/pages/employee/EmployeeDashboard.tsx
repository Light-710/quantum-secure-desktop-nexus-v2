
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Monitor, Server, Activity, FileText } from 'lucide-react';

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeOs, setActiveOs] = useState<'windows' | 'linux'>('windows');
  
  // Empty array for projects data
  const assignedProjects = [];
  
  const handleVmAction = (action: string) => {
    toast({
      title: `VM ${action} Initiated`,
      description: `Your ${activeOs} virtual desktop is ${action === 'Start' ? 'starting' : 'stopping'}...`,
    });
  };
  
  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-cyber-teal">Employee Dashboard - Security Testing</CardTitle>
          <CardDescription className="text-cyber-gray">
            Welcome to your security testing portal. Access your assigned virtual desktops and projects.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Virtual Desktop Section */}
        <div className="md:col-span-2">
          <Card className="glass-panel border-cyber-teal/30 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-teal flex items-center">
                <Monitor className="mr-2 text-cyber-blue" size={20} />
                Virtual Desktop Access
              </CardTitle>
              <CardDescription className="text-cyber-gray">
                Select your preferred operating system and connect to your virtual environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="windows" onValueChange={(value) => setActiveOs(value as 'windows' | 'linux')}>
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-cyber-dark-blue/50">
                  <TabsTrigger value="windows" className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue">
                    Windows
                  </TabsTrigger>
                  <TabsTrigger value="linux" className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue">
                    Linux
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="windows" className="border rounded-md border-cyber-teal/20 p-4 bg-cyber-dark-blue/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-cyber-teal font-medium">Windows 11 Enterprise</h4>
                        <p className="text-sm text-cyber-gray">Status: <span className="text-yellow-400">Not Available</span></p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                          onClick={() => handleVmAction('Start')}
                        >
                          Start
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                          onClick={() => handleVmAction('Stop')}
                          disabled
                        >
                          Stop
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-cyber-gray space-y-1">
                      <div className="flex justify-between">
                        <span>IP Address:</span>
                        <span className="text-cyber-teal font-mono">---.---.---.---</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CPU Usage:</span>
                        <span className="text-cyber-teal">---%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage:</span>
                        <span className="text-cyber-teal">--- / ---</span>
                      </div>
                    </div>
                    
                    <Button className="w-full cyber-button" disabled>
                      Start VM to Connect
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="linux" className="border rounded-md border-cyber-teal/20 p-4 bg-cyber-dark-blue/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-cyber-teal font-medium">Kali Linux 2023.1</h4>
                        <p className="text-sm text-cyber-gray">Status: <span className="text-yellow-400">Not Available</span></p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                          onClick={() => handleVmAction('Start')}
                        >
                          Start
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                          onClick={() => handleVmAction('Stop')}
                          disabled
                        >
                          Stop
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-cyber-gray space-y-1">
                      <div className="flex justify-between">
                        <span>IP Address:</span>
                        <span className="text-cyber-teal font-mono">---.---.---.---</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CPU Usage:</span>
                        <span className="text-cyber-teal">---%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage:</span>
                        <span className="text-cyber-teal">--- / ---</span>
                      </div>
                    </div>
                    
                    <Button className="w-full cyber-button" disabled>
                      Start VM to Connect
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Assigned Projects */}
        <div>
          <Card className="glass-panel border-cyber-teal/30 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-teal flex items-center">
                <Activity className="mr-2 text-cyber-blue" size={20} />
                Your Projects
              </CardTitle>
              <CardDescription className="text-cyber-gray">
                Projects assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedProjects.length > 0 ? (
                  assignedProjects.map((project) => (
                    <div key={project.id} className="border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                      <h4 className="text-cyber-teal font-medium">{project.name}</h4>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-cyber-gray">ID: {project.id}</span>
                        <span className={
                          project.status === 'In Progress' 
                            ? 'text-cyber-blue' 
                            : project.status === 'Pending' 
                              ? 'text-yellow-400' 
                              : 'text-green-400'
                        }>
                          {project.status}
                        </span>
                      </div>
                      <div className="text-xs text-cyber-gray mt-2">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                        >
                          <FileText size={14} className="mr-1" /> Report
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-cyber-gray">
                    No projects assigned to you yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* System Resources */}
      <div className="mt-6">
        <Card className="glass-panel border-cyber-teal/30">
          <CardHeader>
            <CardTitle className="text-xl text-cyber-teal flex items-center">
              <Server className="mr-2 text-cyber-blue" size={20} />
              System Resources
            </CardTitle>
            <CardDescription className="text-cyber-gray">
              Real-time monitoring of your allocated resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPU Usage */}
              <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                <h4 className="text-sm text-cyber-gray">CPU Usage</h4>
                <div className="flex items-end justify-between mt-2">
                  <div className="text-3xl font-semibold text-cyber-blue">---%</div>
                  <div className="text-xs text-cyber-gray">--- Cores / --- Threads</div>
                </div>
                <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                  <div className="h-full bg-cyber-blue" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              {/* Memory Usage */}
              <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                <h4 className="text-sm text-cyber-gray">Memory Usage</h4>
                <div className="flex items-end justify-between mt-2">
                  <div className="text-3xl font-semibold text-cyber-green">---<span className="text-sm font-normal"> GB</span></div>
                  <div className="text-xs text-cyber-gray">of --- GB Allocated</div>
                </div>
                <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                  <div className="h-full bg-cyber-green" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              {/* Storage Usage */}
              <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                <h4 className="text-sm text-cyber-gray">Storage Usage</h4>
                <div className="flex items-end justify-between mt-2">
                  <div className="text-3xl font-semibold text-cyber-teal">---<span className="text-sm font-normal"> GB</span></div>
                  <div className="text-xs text-cyber-gray">of --- GB Allocated</div>
                </div>
                <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                  <div className="h-full bg-cyber-teal" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
