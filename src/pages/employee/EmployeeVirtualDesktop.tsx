import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Monitor, Server } from 'lucide-react';
import { vmService } from '@/services/vmService';
import type { VMStatus } from '@/services/vmService';

const EmployeeVirtualDesktop = () => {
  const { toast } = useToast();
  const [activeOs, setActiveOs] = React.useState<'windows' | 'linux'>('windows');
  const [vmStatus, setVmStatus] = useState<VMStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    loadVMStatus();
  }, []);

  const loadVMStatus = async () => {
    try {
      const status = await vmService.getVMStatus();
      setVmStatus(status);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load VM status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVmAction = async (action: string) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      let response;
      switch (action) {
        case 'Start':
          response = await vmService.startVM(activeOs);
          break;
        case 'Stop':
          response = await vmService.stopVM(activeOs);
          break;
        case 'Restart':
          response = await vmService.restartVM(activeOs);
          break;
        default:
          return;
      }

      toast({
        title: `VM ${action} Initiated`,
        description: response.message,
      });

      // Refresh VM status
      await loadVMStatus();

      // If we got a URL back from starting the VM, we can use it to connect
      if (response.URL) {
        // Handle VM connection URL
        window.open(response.URL, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} VM`,
        variant: "destructive",
      });
    } finally {
      setActionInProgress(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-teal"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-cyber-teal">Virtual Desktop Access</CardTitle>
          <CardDescription className="text-cyber-gray">
            Connect to your secure testing environment
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-cyber-teal/30 h-full">
          <CardHeader>
            <CardTitle className="text-xl text-cyber-teal flex items-center">
              <Monitor className="mr-2 text-cyber-blue" size={20} />
              Virtual Desktop Console
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
                      <p className="text-sm text-cyber-gray">Status: <span className="text-green-400">Ready</span></p>
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
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-cyber-gray space-y-1">
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="text-cyber-teal font-mono">192.168.1.120</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPU Usage:</span>
                      <span className="text-cyber-teal">2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span className="text-cyber-teal">1.2 GB / 8 GB</span>
                    </div>
                  </div>
                  
                  <Button className="w-full cyber-button">
                    Connect to Desktop
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="linux" className="border rounded-md border-cyber-teal/20 p-4 bg-cyber-dark-blue/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-cyber-teal font-medium">Kali Linux 2023.1</h4>
                      <p className="text-sm text-cyber-gray">Status: <span className="text-yellow-400">Stopped</span></p>
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
                      <span className="text-cyber-teal">0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span className="text-cyber-teal">0 GB / 4 GB</span>
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

        <Card className="glass-panel border-cyber-teal/30 h-full">
          <CardHeader>
            <CardTitle className="text-xl text-cyber-teal flex items-center">
              <Server className="mr-2 text-cyber-blue" size={20} />
              Connection Status
            </CardTitle>
            <CardDescription className="text-cyber-gray">
              Real-time monitoring and connection history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                <h4 className="text-cyber-teal font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Secure Connection Established
                </h4>
                <p className="text-sm text-cyber-gray mt-1">
                  VPN tunnel active - 192.168.1.0/24 network accessible
                </p>
                <p className="text-xs text-cyber-gray mt-2">
                  Connected since: {new Date().toLocaleString()}
                </p>
              </div>
              
              <div className="text-sm text-cyber-gray space-y-2">
                <div className="flex justify-between items-center border-b border-cyber-teal/10 pb-2">
                  <span>Connection Type:</span>
                  <span className="text-cyber-teal">AES-256 Encrypted VPN</span>
                </div>
                <div className="flex justify-between items-center border-b border-cyber-teal/10 pb-2">
                  <span>Latency:</span>
                  <span className="text-cyber-teal">12ms</span>
                </div>
                <div className="flex justify-between items-center border-b border-cyber-teal/10 pb-2">
                  <span>Bandwidth:</span>
                  <span className="text-cyber-teal">100 Mbps</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Session Timeout:</span>
                  <span className="text-cyber-teal">4 hours remaining</span>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red">
                  Disconnect Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
        <h3 className="text-lg text-cyber-teal mb-2">Connection History</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-sm flex justify-between border-b border-cyber-teal/10 pb-2 last:border-0">
              <div className="text-cyber-gray">
                {new Date(Date.now() - i * 86400000).toLocaleDateString()} - Windows 11 Enterprise
              </div>
              <div className="text-cyber-blue">
                {Math.floor(Math.random() * 3) + 1} hours
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeVirtualDesktop;
