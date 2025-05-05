
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Database, Server, Shield, Clock, HardDrive } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SystemPage = () => {
  const { toast } = useToast();
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRecoveryDialogOpen, setIsRecoveryDialogOpen] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [recoveryInProgress, setRecoveryInProgress] = useState(false);
  
  // Empty system data
  const systemInfo = {
    lastBackup: 'No backups found',
    backupSize: '0 GB',
    backupStatus: 'Not Available',
    recoveryPoints: [],
    backupLocations: [
      { name: 'Primary Storage', type: 'Local', status: 'Online', freeSpace: 'Unknown' },
      { name: 'Cloud Backup', type: 'Remote', status: 'Offline', freeSpace: 'Unknown' },
    ]
  };
  
  const handleBackup = () => {
    setBackupInProgress(true);
    
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
      setIsBackupDialogOpen(false);
      
      toast({
        title: "Backup Complete",
        description: "System backup has been completed successfully.",
      });
    }, 3000);
  };
  
  const handleRecovery = (recoveryPointId: string) => {
    setRecoveryInProgress(true);
    
    // Simulate recovery process
    setTimeout(() => {
      setRecoveryInProgress(false);
      setIsRecoveryDialogOpen(false);
      
      toast({
        title: "Recovery Complete",
        description: `System has been restored to recovery point ${recoveryPointId}.`,
      });
    }, 5000);
  };

  return (
    <DashboardLayout>
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-cyber-teal">System Management</CardTitle>
          <CardDescription className="text-cyber-gray">
            Manage system configurations, backups and recovery options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Card */}
            <Card className="glass-panel border-cyber-teal/30">
              <CardHeader>
                <CardTitle className="text-xl text-cyber-teal flex items-center">
                  <Database className="mr-2 text-cyber-blue" size={20} />
                  Backup Management
                </CardTitle>
                <CardDescription className="text-cyber-gray">
                  Configure and run system backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                      <div className="text-xs text-cyber-gray">Last Backup</div>
                      <div className="text-cyber-teal mt-1">{systemInfo.lastBackup}</div>
                    </div>
                    <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                      <div className="text-xs text-cyber-gray">Backup Size</div>
                      <div className="text-cyber-teal mt-1">{systemInfo.backupSize}</div>
                    </div>
                    <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                      <div className="text-xs text-cyber-gray">Status</div>
                      <div className="text-yellow-400 mt-1">{systemInfo.backupStatus}</div>
                    </div>
                    <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                      <div className="text-xs text-cyber-gray">Schedule</div>
                      <div className="text-cyber-teal mt-1">Not Configured</div>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      className="w-full cyber-button"
                      onClick={() => setIsBackupDialogOpen(true)}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Create New Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Disaster Recovery Card */}
            <Card className="glass-panel border-cyber-teal/30">
              <CardHeader>
                <CardTitle className="text-xl text-cyber-teal flex items-center">
                  <Shield className="mr-2 text-cyber-blue" size={20} />
                  Disaster Recovery
                </CardTitle>
                <CardDescription className="text-cyber-gray">
                  Restore system from previous backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20 p-3">
                    <div className="text-xs text-cyber-gray mb-2">Recovery Points Available</div>
                    <div className="text-2xl font-semibold text-cyber-blue">{systemInfo.recoveryPoints.length}</div>
                    <div className="text-xs text-cyber-gray mt-1">
                      {systemInfo.recoveryPoints.length > 0 ? 
                        `Oldest: ${systemInfo.recoveryPoints[systemInfo.recoveryPoints.length - 1].date}` : 
                        'No recovery points available'}
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      className="w-full cyber-button"
                      onClick={() => setIsRecoveryDialogOpen(true)}
                      disabled={systemInfo.recoveryPoints.length === 0}
                    >
                      <HardDrive className="mr-2 h-4 w-4" />
                      Restore From Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Backup Storage Locations */}
          <Card className="glass-panel border-cyber-teal/30 mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-teal flex items-center">
                <Server className="mr-2 text-cyber-blue" size={20} />
                Backup Storage Locations
              </CardTitle>
              <CardDescription className="text-cyber-gray">
                Current backup targets and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemInfo.backupLocations.map((location, index) => (
                  <div key={index} className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-cyber-teal">{location.name}</div>
                        <div className="text-xs text-cyber-gray mt-1">{location.type} Storage</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          location.status === 'Online' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-cyber-red/20 text-cyber-red'
                        }`}>
                          {location.status}
                        </div>
                        <div className="text-xs text-cyber-gray mt-2">Free: {location.freeSpace}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      
      {/* Backup Dialog */}
      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyber-teal">Create System Backup</DialogTitle>
            <DialogDescription className="text-cyber-gray">
              This will create a full system backup of all data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-cyber-blue" />
                <span className="text-cyber-teal">Full System Backup</span>
              </div>
              <div className="text-xs text-cyber-gray mt-2">
                Includes all system data, user files, VM snapshots, and configurations.
              </div>
            </div>
            
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="flex items-center">
                <Server className="h-4 w-4 mr-2 text-cyber-blue" />
                <span className="text-cyber-teal">Backup Destinations</span>
              </div>
              <div className="text-xs text-cyber-gray mt-2">
                <ul className="list-disc list-inside space-y-1">
                  {systemInfo.backupLocations.map((location, index) => (
                    <li key={index}>{location.name} ({location.type})</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-cyber-blue" />
                <span className="text-cyber-teal">Estimated Time</span>
              </div>
              <div className="text-xs text-cyber-gray mt-2">
                10-15 minutes depending on data size
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                className="border-cyber-teal/30"
                onClick={() => setIsBackupDialogOpen(false)}
                disabled={backupInProgress}
              >
                Cancel
              </Button>
              <Button 
                className="cyber-button"
                onClick={handleBackup}
                disabled={backupInProgress}
              >
                {backupInProgress ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Backing Up...
                  </>
                ) : (
                  "Start Backup"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Recovery Dialog */}
      <Dialog open={isRecoveryDialogOpen} onOpenChange={setIsRecoveryDialogOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-cyber-teal">System Recovery</DialogTitle>
            <DialogDescription className="text-cyber-gray">
              Select a recovery point to restore the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            {systemInfo.recoveryPoints.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {systemInfo.recoveryPoints.map((point: any) => (
                  <div 
                    key={point.id} 
                    className="mb-3 p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20 hover:bg-cyber-dark-blue/40 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-cyber-teal">{point.date}</div>
                        <div className="text-xs text-cyber-gray mt-1">
                          {point.type} Backup • {point.size}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="cyber-button"
                        onClick={() => handleRecovery(point.id)}
                        disabled={recoveryInProgress}
                      >
                        {recoveryInProgress ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          "Restore"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                <div className="text-center py-6 text-cyber-gray">
                  No recovery points available
                </div>
              </div>
            )}
            
            <div className="p-3 border border-cyber-red/20 rounded-md bg-cyber-dark-blue/20">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-cyber-red" />
                <span className="text-cyber-red">Warning</span>
              </div>
              <div className="text-xs text-cyber-gray mt-2">
                System restoration will replace all current data with the selected backup point. 
                This action cannot be undone.
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                className="border-cyber-teal/30"
                onClick={() => setIsRecoveryDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SystemPage;
