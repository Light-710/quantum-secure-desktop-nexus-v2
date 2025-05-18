
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
  const [vmStartTime, setVmStartTime] = useState<{windows?: Date, linux?: Date}>({});

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
          setVmStartTime(prev => ({ ...prev, [activeOs]: new Date() }));
          
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
          setVmStartTime(prev => ({ ...prev, [activeOs]: undefined }));
          
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
          setVmStartTime(prev => ({ ...prev, [activeOs]: new Date() }));
          
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

  // Calculate remaining time for VM initialization
  const getRemainingTime = (os: 'windows' | 'linux') => {
    if (!vmStartTime[os]) return 0;
    
    const startTime = vmStartTime[os]!;
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const remainingSeconds = Math.max(0, 60 - elapsedSeconds);
    
    return remainingSeconds;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-warm-200"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="border-warm-100/30 mb-6 bg-gradient-to-b from-warm-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-warm-300">Virtual Desktop Access</CardTitle>
          <CardDescription className="text-warm-200">
            Connect to your secure testing environment
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-warm-100/30 h-full bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-warm-300 flex items-center">
              <Monitor className="mr-2 text-warm-100" size={20} />
              Virtual Desktop Console
            </CardTitle>
            <CardDescription className="text-warm-200">
              Select your preferred operating system and connect to your virtual environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="windows" onValueChange={(value) => setActiveOs(value as 'windows' | 'linux')}>
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-warm-50">
                <TabsTrigger value="windows" className="data-[state=active]:bg-warm-100/20 data-[state=active]:text-warm-300">
                  Windows
                </TabsTrigger>
                <TabsTrigger value="linux" className="data-[state=active]:bg-warm-100/20 data-[state=active]:text-warm-300">
                  Linux
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="windows" className="border rounded-md border-warm-100/20 p-4 bg-warm-50/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-warm-300 font-medium">Windows VM</h4>
                      <p className="text-sm text-warm-200">
                        Status: {' '}
                        <span className={
                          vmStatus?.windows?.toLowerCase() === 'running' ? 'text-green-500' : 
                          'text-yellow-500'
                        }>
                          {vmStatus?.windows || 'Not Available'}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-warm-100/30 hover:bg-warm-100/20 hover:text-warm-300"
                        onClick={() => handleVmAction('Start')}
                        disabled={vmStatus?.windows?.toLowerCase() === 'running' || actionInProgress}
                      >
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-warm-100/30 hover:bg-warm-300/20 hover:text-warm-300"
                        onClick={() => handleVmAction('Stop')}
                        disabled={vmStatus?.windows?.toLowerCase() !== 'running' || actionInProgress}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {vmStatus?.windows?.toLowerCase() === 'running' && !canConnect.windows && (
                    <div className="mt-3 p-2 bg-yellow-50 text-yellow-700 rounded border border-yellow-200">
                      <div className="flex items-center">
                        <div className="mr-3 relative">
                          <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                            {getRemainingTime('windows')}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">VM is starting</p>
                          <p className="text-xs">Connection will be available in {getRemainingTime('windows')} seconds</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-warm-200 hover:bg-warm-300 text-white mt-4"
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
              
              <TabsContent value="linux" className="border rounded-md border-warm-100/20 p-4 bg-warm-50/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-warm-300 font-medium">Linux VM</h4>
                      <p className="text-sm text-warm-200">
                        Status: {' '}
                        <span className={
                          vmStatus?.linux?.toLowerCase() === 'running' ? 'text-green-500' : 
                          'text-yellow-500'
                        }>
                          {vmStatus?.linux || 'Not Available'}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-warm-100/30 hover:bg-warm-100/20 hover:text-warm-300"
                        onClick={() => handleVmAction('Start')}
                        disabled={vmStatus?.linux?.toLowerCase() === 'running' || actionInProgress}
                      >
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-warm-100/30 hover:bg-warm-300/20 hover:text-warm-300"
                        onClick={() => handleVmAction('Stop')}
                        disabled={vmStatus?.linux?.toLowerCase() !== 'running' || actionInProgress}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {vmStatus?.linux?.toLowerCase() === 'running' && !canConnect.linux && (
                    <div className="mt-3 p-2 bg-yellow-50 text-yellow-700 rounded border border-yellow-200">
                      <div className="flex items-center">
                        <div className="mr-3 relative">
                          <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                            {getRemainingTime('linux')}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">VM is starting</p>
                          <p className="text-xs">Connection will be available in {getRemainingTime('linux')} seconds</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-warm-200 hover:bg-warm-300 text-white mt-4"
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

        <Card className="border-warm-100/30 h-full bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-warm-300 flex items-center">
              <Server className="mr-2 text-warm-100" size={20} />
              User Guide
            </CardTitle>
            <CardDescription className="text-warm-200">
              How to use your virtual desktop environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-warm-100/20 rounded-md p-3 bg-warm-50/20">
                <h4 className="text-warm-300 font-medium">Getting Started</h4>
                <ul className="text-sm text-warm-200 mt-2 space-y-2 list-disc pl-4">
                  <li>Start your desired VM using the controls on the left</li>
                  <li>Wait for the VM to initialize (approximately 1 minute)</li>
                  <li>Click 'Connect to Desktop' when available</li>
                  <li>Use your regular credentials to log in</li>
                </ul>
              </div>
              
              <div className="border border-warm-100/20 rounded-md p-3 bg-warm-50/20">
                <h4 className="text-warm-300 font-medium">Best Practices</h4>
                <ul className="text-sm text-warm-200 mt-2 space-y-2 list-disc pl-4">
                  <li>Always shut down your VM when not in use</li>
                  <li>Save your work frequently</li>
                  <li>Report any connection or performance issues to your manager</li>
                  <li>Disconnect from the VM when taking extended breaks</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full border-warm-100/30 hover:bg-warm-50"
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
