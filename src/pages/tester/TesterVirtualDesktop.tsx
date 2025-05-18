
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Monitor, Server } from 'lucide-react';
import { vmService } from '@/services/vmService';
import type { VMStatus } from '@/services/vmService';

const TesterVirtualDesktop = () => {
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
      toast.error("Failed to load VM status", {
        description: "Could not retrieve the current status of your virtual machines."
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
          // Show immediate toast about starting
          toast.info(`Starting ${activeOs} VM`, {
            description: "This will take about a minute. Please wait."
          });
          
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
            
            toast.success(`VM Ready`, {
              description: `Your ${activeOs} VM is now ready to connect.`,
            });
          }, 60000); // 60 seconds = 1 minute
          
          setConnectTimers(prev => ({ ...prev, [activeOs]: timer }));
          break;
          
        case 'Stop':
          response = await vmService.stopVM(activeOs);
          toast.info(`${activeOs} VM stopped`, {
            description: response.message || "Virtual machine has been stopped successfully."
          });
          
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
          toast.info(`Restarting ${activeOs} VM`, {
            description: "This will take about a minute. Please wait."
          });
          
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
            
            toast.success(`VM Ready`, {
              description: `Your ${activeOs} VM is now ready to connect.`,
            });
          }, 60000); // 60 seconds = 1 minute
          
          setConnectTimers(prev => ({ ...prev, [activeOs]: restartTimer }));
          break;
          
        default:
          return;
      }

      // Refresh VM status
      await loadVMStatus();

      // If we got a URL back from starting the VM, store it (but don't connect yet)
      if (response.URL) {
        setConnectionUrls(prev => ({ ...prev, [activeOs]: response.URL }));
      }
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()} VM`, {
        description: "An error occurred while managing your virtual machine. Please try again."
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="border-primary/10 mb-6 bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-primary/80">Virtual Desktop Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect to your secure testing environment
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10 h-full bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-primary/80 flex items-center">
              <Monitor className="mr-2 text-muted-foreground" size={20} />
              Virtual Desktop Console
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select your preferred operating system and connect to your virtual environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="windows" onValueChange={(value) => setActiveOs(value as 'windows' | 'linux')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="windows">
                  Windows
                </TabsTrigger>
                <TabsTrigger value="linux">
                  Linux
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="windows" className="border rounded-md border-input p-4 bg-card/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-primary/80 font-medium">Windows VM</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: {' '}
                        <span className={
                          vmStatus?.windows?.toLowerCase() === 'running' ? 'text-green-500' : 
                          'text-amber-500'
                        }>
                          {vmStatus?.windows || 'Not Available'}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-input hover:bg-primary/20 hover:text-primary"
                        onClick={() => handleVmAction('Start')}
                        disabled={vmStatus?.windows?.toLowerCase() === 'running' || actionInProgress}
                      >
                        {actionInProgress && activeOs === 'windows' ? (
                          <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : null}
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-input hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => handleVmAction('Stop')}
                        disabled={vmStatus?.windows?.toLowerCase() !== 'running' || actionInProgress}
                      >
                        {actionInProgress && activeOs === 'windows' ? (
                          <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : null}
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {vmStatus?.windows?.toLowerCase() === 'running' && !canConnect.windows && (
                    <div className="mt-3 p-2 bg-amber-50 text-amber-700 rounded border border-amber-200">
                      <div className="flex items-center">
                        <div className="mr-3 relative">
                          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
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
                    className="w-full bg-primary/80 hover:bg-primary text-primary-foreground mt-4"
                    disabled={!canConnect.windows || vmStatus?.windows?.toLowerCase() !== 'running' || !connectionUrls.windows}
                    onClick={handleConnect}
                  >
                    {!canConnect.windows && vmStatus?.windows?.toLowerCase() === 'running' ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        Preparing connection...
                      </>
                    ) : vmStatus?.windows?.toLowerCase() === 'running' ? (
                      'Connect to Desktop'
                    ) : (
                      'Start VM to Connect'
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="linux" className="border rounded-md border-input p-4 bg-card/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-primary/80 font-medium">Linux VM</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: {' '}
                        <span className={
                          vmStatus?.linux?.toLowerCase() === 'running' ? 'text-green-500' : 
                          'text-amber-500'
                        }>
                          {vmStatus?.linux || 'Not Available'}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-input hover:bg-primary/20 hover:text-primary"
                        onClick={() => handleVmAction('Start')}
                        disabled={vmStatus?.linux?.toLowerCase() === 'running' || actionInProgress}
                      >
                        {actionInProgress && activeOs === 'linux' ? (
                          <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : null}
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-input hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => handleVmAction('Stop')}
                        disabled={vmStatus?.linux?.toLowerCase() !== 'running' || actionInProgress}
                      >
                        {actionInProgress && activeOs === 'linux' ? (
                          <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : null}
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {vmStatus?.linux?.toLowerCase() === 'running' && !canConnect.linux && (
                    <div className="mt-3 p-2 bg-amber-50 text-amber-700 rounded border border-amber-200">
                      <div className="flex items-center">
                        <div className="mr-3 relative">
                          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
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
                    className="w-full bg-primary/80 hover:bg-primary text-primary-foreground mt-4"
                    disabled={!canConnect.linux || vmStatus?.linux?.toLowerCase() !== 'running' || !connectionUrls.linux}
                    onClick={handleConnect}
                  >
                    {!canConnect.linux && vmStatus?.linux?.toLowerCase() === 'running' ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        Preparing connection...
                      </>
                    ) : vmStatus?.linux?.toLowerCase() === 'running' ? (
                      'Connect to Desktop'
                    ) : (
                      'Start VM to Connect'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-primary/10 h-full bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-primary/80 flex items-center">
              <Server className="mr-2 text-muted-foreground" size={20} />
              User Guide
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              How to use your virtual desktop environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-input rounded-md p-3 bg-card/50">
                <h4 className="text-primary/80 font-medium">Getting Started</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-2 list-disc pl-4">
                  <li>Start your desired VM using the controls on the left</li>
                  <li>Wait for the VM to initialize (approximately 1 minute)</li>
                  <li>Click 'Connect to Desktop' when available</li>
                  <li>Use your regular credentials to log in</li>
                </ul>
              </div>
              
              <div className="border border-input rounded-md p-3 bg-card/50">
                <h4 className="text-primary/80 font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-2 list-disc pl-4">
                  <li>Always shut down your VM when not in use</li>
                  <li>Save your work frequently</li>
                  <li>Report any connection or performance issues to your manager</li>
                  <li>Disconnect from the VM when taking extended breaks</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full border-input hover:bg-background"
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
