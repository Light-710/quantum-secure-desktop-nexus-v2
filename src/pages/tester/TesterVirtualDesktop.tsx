
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Monitor, Server } from 'lucide-react';
import { vmService } from '@/services/vmService';
import type { VMStatus } from '@/services/vmService';

const TesterVirtualDesktop = () => {
  const { toast } = useToast();
  const [activeOs, setActiveOs] = React.useState<'windows' | 'linux'>('windows');
  const [vmStatus, setVmStatus] = useState<VMStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [connectionUrls, setConnectionUrls] = useState<{windows?: string, linux?: string}>({});
  const [connectTimers, setConnectTimers] = useState<{windows?: NodeJS.Timeout, linux?: NodeJS.Timeout}>({});
  const [canConnect, setCanConnect] = useState<{windows: boolean, linux: boolean}>({
    windows: false,
    linux: false
  });

  useEffect(() => {
    loadVMStatus();
    
    // Clear timers on component unmount
    return () => {
      Object.values(connectTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const loadVMStatus = async () => {
    try {
      const status = await vmService.getVMStatus();
      setVmStatus(status);
      
      // Check if VMs are already running
      if (status.windows?.toLowerCase() === 'running') {
        setCanConnect(prev => ({ ...prev, windows: true }));
      }
      if (status.linux?.toLowerCase() === 'running') {
        setCanConnect(prev => ({ ...prev, linux: true }));
      }
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
          
          // Clear any existing timer
          if (connectTimers[activeOs]) {
            clearTimeout(connectTimers[activeOs]);
          }
          
          // Set 1-minute timer before showing connect button
          setCanConnect(prev => ({ ...prev, [activeOs]: false }));
          
          const timer = setTimeout(() => {
            setCanConnect(prev => ({ ...prev, [activeOs]: true }));
            
            if (response.URL) {
              setConnectionUrls(prev => ({ ...prev, [activeOs]: response.URL }));
            }
            
            // Clear timer reference
            setConnectTimers(prev => ({ ...prev, [activeOs]: undefined }));
            
            toast({
              title: `VM Ready`,
              description: `Your ${activeOs} VM is now ready to connect.`,
            });
          }, 60000); // 60 seconds = 1 minute
          
          setConnectTimers(prev => ({ ...prev, [activeOs]: timer }));
          break;
          
        case 'Stop':
          response = await vmService.stopVM(activeOs);
          // Reset connection state
          setCanConnect(prev => ({ ...prev, [activeOs]: false }));
          setConnectionUrls(prev => ({ ...prev, [activeOs]: undefined }));
          
          // Clear any timer that might be running
          if (connectTimers[activeOs]) {
            clearTimeout(connectTimers[activeOs]);
            setConnectTimers(prev => ({ ...prev, [activeOs]: undefined }));
          }
          break;
          
        case 'Restart':
          response = await vmService.restartVM(activeOs);
          
          // Reset connection state temporarily
          setCanConnect(prev => ({ ...prev, [activeOs]: false }));
          
          // Clear any existing timer
          if (connectTimers[activeOs]) {
            clearTimeout(connectTimers[activeOs]);
          }
          
          // Set 1-minute timer before showing connect button
          const restartTimer = setTimeout(() => {
            setCanConnect(prev => ({ ...prev, [activeOs]: true }));
            
            if (response.URL) {
              setConnectionUrls(prev => ({ ...prev, [activeOs]: response.URL }));
            }
            
            // Clear timer reference
            setConnectTimers(prev => ({ ...prev, [activeOs]: undefined }));
            
            toast({
              title: `VM Ready`,
              description: `Your ${activeOs} VM is now ready to connect.`,
            });
          }, 60000); // 60 seconds = 1 minute
          
          setConnectTimers(prev => ({ ...prev, [activeOs]: restartTimer }));
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

      // If we got a URL back from starting the VM, store it (but don't connect yet)
      if (response.URL) {
        setConnectionUrls(prev => ({ ...prev, [activeOs]: response.URL }));
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

  const handleConnect = () => {
    const url = connectionUrls[activeOs];
    if (url) {
      window.open(url, '_blank');
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
                      <h4 className="text-cyber-teal font-medium">Windows VM</h4>
                      <p className="text-sm text-cyber-gray">
                        Status: {' '}
                        <span className={
                          vmStatus?.windows?.toLowerCase() === 'running' ? 'text-green-400' : 
                          'text-yellow-400'
                        }>
                          {vmStatus?.windows || 'Not Available'}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                        onClick={() => handleVmAction('Start')}
                        disabled={vmStatus?.windows?.toLowerCase() === 'running' || actionInProgress}
                      >
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                        onClick={() => handleVmAction('Stop')}
                        disabled={vmStatus?.windows?.toLowerCase() !== 'running' || actionInProgress}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {vmStatus?.windows?.toLowerCase() === 'running' && !canConnect.windows && (
                    <div className="text-sm mt-3 p-2 bg-yellow-500/20 text-yellow-500 rounded border border-yellow-500/30">
                      <p>VM is starting. Connection will be available in 1 minute...</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full cyber-button mt-4"
                    disabled={!canConnect.windows || vmStatus?.windows?.toLowerCase() !== 'running' || !connectionUrls.windows}
                    onClick={handleConnect}
                  >
                    {!canConnect.windows && vmStatus?.windows?.toLowerCase() === 'running'
                      ? 'Preparing connection...'
                      : vmStatus?.windows?.toLowerCase() === 'running'
                        ? 'Connect to Desktop'
                        : 'Start VM to Connect'
                    }
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="linux" className="border rounded-md border-cyber-teal/20 p-4 bg-cyber-dark-blue/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-cyber-teal font-medium">Linux VM</h4>
                      <p className="text-sm text-cyber-gray">
                        Status: {' '}
                        <span className={
                          vmStatus?.linux?.toLowerCase() === 'running' ? 'text-green-400' : 
                          'text-yellow-400'
                        }>
                          {vmStatus?.linux || 'Not Available'}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                        onClick={() => handleVmAction('Start')}
                        disabled={vmStatus?.linux?.toLowerCase() === 'running' || actionInProgress}
                      >
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                        onClick={() => handleVmAction('Stop')}
                        disabled={vmStatus?.linux?.toLowerCase() !== 'running' || actionInProgress}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {vmStatus?.linux?.toLowerCase() === 'running' && !canConnect.linux && (
                    <div className="text-sm mt-3 p-2 bg-yellow-500/20 text-yellow-500 rounded border border-yellow-500/30">
                      <p>VM is starting. Connection will be available in 1 minute...</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full cyber-button mt-4"
                    disabled={!canConnect.linux || vmStatus?.linux?.toLowerCase() !== 'running' || !connectionUrls.linux}
                    onClick={handleConnect}
                  >
                    {!canConnect.linux && vmStatus?.linux?.toLowerCase() === 'running'
                      ? 'Preparing connection...'
                      : vmStatus?.linux?.toLowerCase() === 'running'
                        ? 'Connect to Desktop'
                        : 'Start VM to Connect'
                    }
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
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    vmStatus?.windows?.toLowerCase() === 'running' || vmStatus?.linux?.toLowerCase() === 'running'
                    ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></span>
                  Connection Status
                </h4>
                <p className="text-sm text-cyber-gray mt-1">
                  {(vmStatus?.windows?.toLowerCase() === 'running' || vmStatus?.linux?.toLowerCase() === 'running')
                    ? 'VPN tunnel active - secure connection available'
                    : 'No active connections'
                  }
                </p>
              </div>
              
              <div className="border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                <h4 className="text-cyber-teal font-medium">Connection Instructions</h4>
                <ul className="text-sm text-cyber-gray mt-2 space-y-2 list-disc pl-4">
                  <li>Start your desired VM using the controls above</li>
                  <li>Wait for approximately 1 minute for the VM to fully initialize</li>
                  <li>Click 'Connect to Desktop' when available</li>
                  <li>Use your regular credentials to log in</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full border-cyber-teal/30"
                  onClick={loadVMStatus}
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TesterVirtualDesktop;
