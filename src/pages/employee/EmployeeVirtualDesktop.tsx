
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle, Monitor, Server } from 'lucide-react';
import { vmService } from '@/services/vmService';
import type { VMStatus } from '@/services/vmService';

const EmployeeVirtualDesktop = () => {
  const { toast } = useToast();
  const [activeOs, setActiveOs] = React.useState<'windows' | 'linux'>('windows');
  const [vmStatus, setVmStatus] = useState<VMStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  
  // New state variables for VM startup simulation
  const [startingOS, setStartingOS] = useState<{windows: boolean, linux: boolean}>({
    windows: false, 
    linux: false
  });
  const [timeRemaining, setTimeRemaining] = useState<{windows: number, linux: number}>({
    windows: 0, 
    linux: 0
  });
  const [osStatus, setOsStatus] = useState<{windows: string, linux: string}>({
    windows: 'Ready', 
    linux: 'Stopped'
  });

  // State for the loading timers to be cleared if user navigates away
  const [loadingTimers, setLoadingTimers] = useState<{
    windows?: NodeJS.Timeout,
    linux?: NodeJS.Timeout
  }>({});

  useEffect(() => {
    loadVMStatus();
    
    // Clear timers on component unmount to handle navigation away
    return () => {
      if (loadingTimers.windows) clearTimeout(loadingTimers.windows);
      if (loadingTimers.linux) clearTimeout(loadingTimers.linux);
    };
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
          // Set the OS as starting
          setStartingOS(prev => ({...prev, [activeOs]: true}));
          
          // Set initial time remaining for countdown
          setTimeRemaining(prev => ({...prev, [activeOs]: 60}));
          
          // Start countdown timer
          let remainingTime = 60;
          const countdownInterval = setInterval(() => {
            remainingTime -= 1;
            setTimeRemaining(prev => ({...prev, [activeOs]: remainingTime}));
            
            if (remainingTime <= 0) {
              clearInterval(countdownInterval);
            }
          }, 1000);
          
          // Start the timer to simulate VM startup
          const timer = setTimeout(async () => {
            // Clear the starting state
            setStartingOS(prev => ({...prev, [activeOs]: false}));
            
            // Update the OS status
            setOsStatus(prev => ({...prev, [activeOs]: 'Running'}));
            
            // Make the API call 
            response = await vmService.startVM(activeOs);
            
            // Clear the timer reference
            setLoadingTimers(prev => ({...prev, [activeOs]: undefined}));
            
            toast({
              title: 'VM Started',
              description: `Your ${activeOs} virtual desktop is now ready to use.`,
            });

            setActionInProgress(false);
          }, 60000); // 60 seconds
          
          // Store the timer reference to clear it if needed
          setLoadingTimers(prev => ({...prev, [activeOs]: timer}));
          break;
          
        case 'Stop':
          response = await vmService.stopVM(activeOs);
          
          // Update status immediately
          setOsStatus(prev => ({...prev, [activeOs]: 'Stopped'}));
          
          toast({
            title: `VM ${action} Initiated`,
            description: response.message,
          });

          // Refresh VM status
          await loadVMStatus();
          break;
          
        case 'Restart':
          response = await vmService.restartVM(activeOs);
          
          toast({
            title: `VM ${action} Initiated`,
            description: response.message,
          });

          // Refresh VM status
          await loadVMStatus();
          break;
          
        default:
          return;
      }

      // If action is something other than Start, handle response
      if (action !== 'Start') {
        // If we got a URL back, we can use it to connect
        if (response && response.URL) {
          window.open(response.URL, '_blank');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} VM`,
        variant: "destructive",
      });
      // Clear starting state if there's an error
      if (action === 'Start') {
        setStartingOS(prev => ({...prev, [activeOs]: false}));
        if (loadingTimers[activeOs as keyof typeof loadingTimers]) {
          clearTimeout(loadingTimers[activeOs as keyof typeof loadingTimers]);
          setLoadingTimers(prev => ({...prev, [activeOs]: undefined}));
        }
      }
      setActionInProgress(false);
    } finally {
      // For Stop and Restart, we can clear actionInProgress here
      // For Start, it's cleared after the timer completes
      if (action !== 'Start') {
        setActionInProgress(false);
      }
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
                      <p className="text-sm text-cyber-gray">
                        Status: <span className={osStatus.windows === 'Running' ? "text-green-400" : "text-yellow-400"}>
                          {osStatus.windows}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                        onClick={() => handleVmAction('Start')}
                        disabled={startingOS.windows || startingOS.linux || osStatus.windows === 'Running'}
                      >
                        {startingOS.windows ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          'Start'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                        onClick={() => handleVmAction('Stop')}
                        disabled={startingOS.windows || startingOS.linux || osStatus.windows !== 'Running'}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {startingOS.windows && (
                    <div className="mt-3 p-3 bg-cyber-dark-blue/30 rounded border border-cyber-teal/20">
                      <div className="flex items-center">
                        <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-cyber-blue" />
                        <div>
                          <p className="font-medium text-cyber-teal">Initializing VM...</p>
                          <p className="text-xs text-cyber-gray">
                            This will take approximately {timeRemaining.windows} seconds
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                  
                  <Button 
                    className={`w-full ${osStatus.windows === 'Running' 
                      ? 'cyber-button bg-cyber-blue hover:bg-cyber-blue/80' 
                      : 'bg-cyber-dark-blue/30 text-cyber-gray'}`}
                    disabled={osStatus.windows !== 'Running'}
                  >
                    {osStatus.windows === 'Running' ? 'Connect to Desktop' : 'Start VM to Connect'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="linux" className="border rounded-md border-cyber-teal/20 p-4 bg-cyber-dark-blue/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-cyber-teal font-medium">Kali Linux 2023.1</h4>
                      <p className="text-sm text-cyber-gray">
                        Status: <span className={osStatus.linux === 'Running' ? "text-green-400" : "text-yellow-400"}>
                          {osStatus.linux}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                        onClick={() => handleVmAction('Start')}
                        disabled={startingOS.windows || startingOS.linux || osStatus.linux === 'Running'}
                      >
                        {startingOS.linux ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          'Start'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                        onClick={() => handleVmAction('Stop')}
                        disabled={startingOS.windows || startingOS.linux || osStatus.linux !== 'Running'}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                  
                  {startingOS.linux && (
                    <div className="mt-3 p-3 bg-cyber-dark-blue/30 rounded border border-cyber-teal/20">
                      <div className="flex items-center">
                        <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-cyber-blue" />
                        <div>
                          <p className="font-medium text-cyber-teal">Initializing VM...</p>
                          <p className="text-xs text-cyber-gray">
                            This will take approximately {timeRemaining.linux} seconds
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-cyber-gray space-y-1">
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="text-cyber-teal font-mono">
                        {osStatus.linux === 'Running' ? '192.168.2.45' : '---.---.---.---'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPU Usage:</span>
                      <span className="text-cyber-teal">{osStatus.linux === 'Running' ? '5%' : '0%'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span className="text-cyber-teal">
                        {osStatus.linux === 'Running' ? '768 MB / 4 GB' : '0 GB / 4 GB'}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full ${osStatus.linux === 'Running' 
                      ? 'cyber-button bg-cyber-blue hover:bg-cyber-blue/80' 
                      : 'bg-cyber-dark-blue/30 text-cyber-gray'}`}
                    disabled={osStatus.linux !== 'Running'}
                  >
                    {osStatus.linux === 'Running' ? 'Connect to Desktop' : 'Start VM to Connect'}
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
