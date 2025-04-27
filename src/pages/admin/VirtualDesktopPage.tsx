
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Monitor, Server, Power, RefreshCw, HardDrive, Clock, 
  Cpu, Network, Shield, Plus
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// VM type definition
type VirtualMachine = {
  id: string;
  name: string;
  os: 'Windows' | 'Linux' | 'Other';
  status: 'Running' | 'Stopped' | 'Paused' | 'Error';
  assigned_user: string;
  uptime: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  health: 'Good' | 'Fair' | 'Poor';
  last_snapshot: string;
  ip_address: string;
};

// Sample VM data
const sampleVMs: VirtualMachine[] = [
  {
    id: 'VM001',
    name: 'PenTest-Win-01',
    os: 'Windows',
    status: 'Running',
    assigned_user: 'john_emp',
    uptime: '8h 12m',
    resources: {
      cpu: 15,
      memory: 32,
      disk: 45,
      network: 10,
    },
    health: 'Good',
    last_snapshot: '2025-04-26 18:00',
    ip_address: '10.0.0.101',
  },
  {
    id: 'VM002',
    name: 'PenTest-Lin-01',
    os: 'Linux',
    status: 'Stopped',
    assigned_user: 'john_emp',
    uptime: '0h 0m',
    resources: {
      cpu: 0,
      memory: 0,
      disk: 32,
      network: 0,
    },
    health: 'Good',
    last_snapshot: '2025-04-26 14:30',
    ip_address: '10.0.0.102',
  },
  {
    id: 'VM003',
    name: 'PenTest-Win-02',
    os: 'Windows',
    status: 'Running',
    assigned_user: 'jane_mgr',
    uptime: '2h 45m',
    resources: {
      cpu: 25,
      memory: 45,
      disk: 38,
      network: 15,
    },
    health: 'Fair',
    last_snapshot: '2025-04-25 09:15',
    ip_address: '10.0.0.103',
  },
  {
    id: 'VM004',
    name: 'PenTest-Win-03',
    os: 'Windows',
    status: 'Paused',
    assigned_user: 'alex_adm',
    uptime: '4h 30m',
    resources: {
      cpu: 0,
      memory: 15,
      disk: 40,
      network: 0,
    },
    health: 'Good',
    last_snapshot: '2025-04-25 15:20',
    ip_address: '10.0.0.104',
  },
  {
    id: 'VM005',
    name: 'PenTest-Lin-02',
    os: 'Linux',
    status: 'Running',
    assigned_user: 'jane_mgr',
    uptime: '36h 15m',
    resources: {
      cpu: 10,
      memory: 25,
      disk: 30,
      network: 8,
    },
    health: 'Good',
    last_snapshot: '2025-04-24 11:45',
    ip_address: '10.0.0.105',
  },
  {
    id: 'VM006',
    name: 'PenTest-Win-04',
    os: 'Windows',
    status: 'Error',
    assigned_user: 'john_emp',
    uptime: '0h 0m',
    resources: {
      cpu: 0,
      memory: 0,
      disk: 42,
      network: 0,
    },
    health: 'Poor',
    last_snapshot: '2025-04-23 16:30',
    ip_address: '10.0.0.106',
  },
];

const VirtualDesktopPage = () => {
  const { toast } = useToast();
  const [vms, setVMs] = useState<VirtualMachine[]>(sampleVMs);
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Handle VM actions
  const handleVMAction = (vmId: string, action: string) => {
    setActionLoading(vmId);
    
    // Simulate action processing
    setTimeout(() => {
      const updatedVMs = vms.map(vm => {
        if (vm.id === vmId) {
          let newStatus: VirtualMachine['status'] = vm.status;
          let newUptime = vm.uptime;
          let newResources = { ...vm.resources };
          
          switch (action) {
            case 'Start':
              newStatus = 'Running';
              newUptime = '0h 1m';
              newResources = {
                ...newResources,
                cpu: 5,
                memory: 10,
                network: 2,
              };
              break;
            case 'Stop':
              newStatus = 'Stopped';
              newUptime = '0h 0m';
              newResources = {
                ...newResources,
                cpu: 0,
                memory: 0,
                network: 0,
              };
              break;
            case 'Pause':
              newStatus = 'Paused';
              newResources = {
                ...newResources,
                cpu: 0,
                network: 0,
              };
              break;
            case 'Resume':
              newStatus = 'Running';
              newResources = {
                ...newResources,
                cpu: 10,
                network: 5,
              };
              break;
            case 'Reset':
              newStatus = 'Running';
              newUptime = '0h 1m';
              newResources = {
                ...newResources,
                cpu: 15,
                memory: 20,
                network: 10,
              };
              break;
          }
          
          return {
            ...vm,
            status: newStatus,
            uptime: newUptime,
            resources: newResources,
          };
        }
        return vm;
      });
      
      setVMs(updatedVMs);
      setActionLoading(null);
      
      toast({
        title: `${action} Successful`,
        description: `Virtual desktop ${vmId} has been ${action.toLowerCase()}ed.`,
      });
      
      // Update selected VM if it's the one we just modified
      if (selectedVM && selectedVM.id === vmId) {
        const updatedVM = updatedVMs.find(vm => vm.id === vmId);
        if (updatedVM) {
          setSelectedVM(updatedVM);
        }
      }
    }, 2000);
  };
  
  const handleViewDetails = (vm: VirtualMachine) => {
    setSelectedVM(vm);
    setIsDetailsOpen(true);
  };
  
  // Calculate overall system stats
  const runningVMs = vms.filter(vm => vm.status === 'Running').length;
  const totalCPUUsage = vms.reduce((sum, vm) => sum + vm.resources.cpu, 0) / vms.length;
  const totalMemoryUsage = vms.reduce((sum, vm) => sum + vm.resources.memory, 0) / vms.length;
  const vmsByOs = {
    Windows: vms.filter(vm => vm.os === 'Windows').length,
    Linux: vms.filter(vm => vm.os === 'Linux').length,
    Other: vms.filter(vm => vm.os === 'Other').length,
  };
  
  // Create snapshot for a VM
  const handleCreateSnapshot = (vmId: string) => {
    setActionLoading(vmId);
    
    setTimeout(() => {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const updatedVMs = vms.map(vm => {
        if (vm.id === vmId) {
          return {
            ...vm,
            last_snapshot: formattedDate,
          };
        }
        return vm;
      });
      
      setVMs(updatedVMs);
      setActionLoading(null);
      
      toast({
        title: "Snapshot Created",
        description: `Snapshot for ${vmId} has been created successfully.`,
      });
      
      // Update selected VM if it's the one we just modified
      if (selectedVM && selectedVM.id === vmId) {
        const updatedVM = updatedVMs.find(vm => vm.id === vmId);
        if (updatedVM) {
          setSelectedVM(updatedVM);
        }
      }
    }, 3000);
  };

  return (
    <DashboardLayout>
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-cyber-teal">Virtual Desktop Management</CardTitle>
            <CardDescription className="text-cyber-gray">
              Monitor and control virtual desktop instances
            </CardDescription>
          </div>
          <Button className="cyber-button">
            <Plus className="mr-2 h-4 w-4" /> New VM
          </Button>
        </CardHeader>
        <CardContent>
          {/* System Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Running VMs</p>
                    <h3 className="text-3xl font-bold text-cyber-blue mt-1">
                      {runningVMs}/{vms.length}
                    </h3>
                  </div>
                  <div className="bg-cyber-blue/10 p-3 rounded-full">
                    <Monitor className="h-6 w-6 text-cyber-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Avg. CPU</p>
                    <h3 className="text-3xl font-bold text-cyber-green mt-1">{totalCPUUsage.toFixed(0)}%</h3>
                  </div>
                  <div className="bg-cyber-green/10 p-3 rounded-full">
                    <Cpu className="h-6 w-6 text-cyber-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Avg. Memory</p>
                    <h3 className="text-3xl font-bold text-cyber-teal mt-1">{totalMemoryUsage.toFixed(0)}%</h3>
                  </div>
                  <div className="bg-cyber-teal/10 p-3 rounded-full">
                    <HardDrive className="h-6 w-6 text-cyber-teal" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">OS Distribution</p>
                    <div className="flex space-x-2 mt-2">
                      <div className="text-xs">
                        <span className="text-blue-400">{vmsByOs.Windows} Win</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-yellow-400">{vmsByOs.Linux} Lin</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-purple-400">{vmsByOs.Other} Other</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-400/10 p-3 rounded-full">
                    <Server className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* VM Table */}
          <div className="rounded-md border border-cyber-teal/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-cyber-dark-blue/40">
                <TableRow>
                  <TableHead className="text-cyber-teal">VM</TableHead>
                  <TableHead className="text-cyber-teal">Status</TableHead>
                  <TableHead className="text-cyber-teal">User</TableHead>
                  <TableHead className="text-cyber-teal">Uptime</TableHead>
                  <TableHead className="text-cyber-teal">Resources</TableHead>
                  <TableHead className="text-cyber-teal">Health</TableHead>
                  <TableHead className="text-cyber-teal">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vms.map((vm) => (
                  <TableRow key={vm.id} className={`hover:bg-cyber-dark-blue/20 ${
                    vm.status === 'Error' ? 'bg-cyber-red/5' : ''
                  }`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white border ${
                            vm.os === 'Windows' ? 'bg-blue-500/20 border-blue-500/30' : 
                            vm.os === 'Linux' ? 'bg-yellow-500/20 border-yellow-500/30' : 
                            'bg-purple-500/20 border-purple-500/30'
                          }`}>
                            {vm.os === 'Windows' ? 'W' : vm.os === 'Linux' ? 'L' : 'O'}
                          </div>
                        </div>
                        <div>
                          <button 
                            className="text-sm font-medium text-cyber-teal hover:text-cyber-blue"
                            onClick={() => handleViewDetails(vm)}
                          >
                            {vm.name}
                          </button>
                          <div className="text-xs text-cyber-gray">{vm.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        vm.status === 'Running' ? 'bg-green-400/20 text-green-400' : 
                        vm.status === 'Stopped' ? 'bg-cyber-gray/20 text-cyber-gray' :
                        vm.status === 'Paused' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-cyber-red/20 text-cyber-red'
                      }`}>
                        {vm.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-cyber-gray">{vm.assigned_user}</TableCell>
                    <TableCell className="text-sm text-cyber-gray">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} className="text-cyber-blue" />
                        <span>{vm.uptime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs space-x-2">
                          <span className="text-cyber-gray w-12">CPU:</span>
                          <div className="w-16 bg-cyber-dark-blue rounded-full h-1.5">
                            <div 
                              className="bg-cyber-blue rounded-full h-1.5" 
                              style={{ width: `${vm.resources.cpu}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyber-blue">{vm.resources.cpu}%</span>
                        </div>
                        <div className="flex items-center text-xs space-x-2">
                          <span className="text-cyber-gray w-12">Memory:</span>
                          <div className="w-16 bg-cyber-dark-blue rounded-full h-1.5">
                            <div 
                              className="bg-cyber-green rounded-full h-1.5" 
                              style={{ width: `${vm.resources.memory}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyber-green">{vm.resources.memory}%</span>
                        </div>
                        <div className="flex items-center text-xs space-x-2">
                          <span className="text-cyber-gray w-12">Disk:</span>
                          <div className="w-16 bg-cyber-dark-blue rounded-full h-1.5">
                            <div 
                              className="bg-cyber-teal rounded-full h-1.5" 
                              style={{ width: `${vm.resources.disk}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyber-teal">{vm.resources.disk}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        vm.health === 'Good' ? 'bg-green-400/20 text-green-400' : 
                        vm.health === 'Fair' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-cyber-red/20 text-cyber-red'
                      }`}>
                        {vm.health}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {vm.status === 'Running' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                              onClick={() => handleVMAction(vm.id, 'Stop')}
                              disabled={actionLoading === vm.id}
                            >
                              {actionLoading === vm.id ? (
                                <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-yellow-400/20 hover:text-yellow-400"
                              onClick={() => handleVMAction(vm.id, 'Pause')}
                              disabled={actionLoading === vm.id}
                            >
                              {actionLoading === vm.id ? (
                                <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                              ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" />
                                  <rect x="14" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              )}
                            </Button>
                          </>
                        ) : vm.status === 'Paused' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-green-400/20 hover:text-green-400"
                            onClick={() => handleVMAction(vm.id, 'Resume')}
                            disabled={actionLoading === vm.id}
                          >
                            {actionLoading === vm.id ? (
                              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                              </svg>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-green-400/20 hover:text-green-400"
                            onClick={() => handleVMAction(vm.id, 'Start')}
                            disabled={actionLoading === vm.id}
                          >
                            {actionLoading === vm.id ? (
                              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                              </svg>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                          onClick={() => handleViewDetails(vm)}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                        {(vm.status === 'Error' || vm.status === 'Stopped') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                            onClick={() => handleVMAction(vm.id, 'Reset')}
                            disabled={actionLoading === vm.id}
                          >
                            {actionLoading === vm.id ? (
                              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* VM Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-cyber-teal">Virtual Desktop Details</DialogTitle>
            <DialogDescription className="text-cyber-gray">
              {selectedVM?.name} ({selectedVM?.id})
            </DialogDescription>
          </DialogHeader>
          
          {selectedVM && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                  <div className="text-xs text-cyber-gray">Operating System</div>
                  <div className={`text-sm mt-1 ${
                    selectedVM.os === 'Windows' ? 'text-blue-400' : 
                    selectedVM.os === 'Linux' ? 'text-yellow-400' : 
                    'text-purple-400'
                  }`}>
                    {selectedVM.os}
                  </div>
                </div>
                <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                  <div className="text-xs text-cyber-gray">Status</div>
                  <div className={`text-sm mt-1 ${
                    selectedVM.status === 'Running' ? 'text-green-400' : 
                    selectedVM.status === 'Stopped' ? 'text-cyber-gray' :
                    selectedVM.status === 'Paused' ? 'text-yellow-400' :
                    'text-cyber-red'
                  }`}>
                    {selectedVM.status}
                  </div>
                </div>
                <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                  <div className="text-xs text-cyber-gray">Assigned User</div>
                  <div className="text-sm text-cyber-teal mt-1">{selectedVM.assigned_user}</div>
                </div>
                <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                  <div className="text-xs text-cyber-gray">IP Address</div>
                  <div className="text-sm text-cyber-teal mt-1">{selectedVM.ip_address}</div>
                </div>
                <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                  <div className="text-xs text-cyber-gray">Uptime</div>
                  <div className="text-sm text-cyber-teal mt-1">{selectedVM.uptime}</div>
                </div>
                <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                  <div className="text-xs text-cyber-gray">Health</div>
                  <div className={`text-sm mt-1 ${
                    selectedVM.health === 'Good' ? 'text-green-400' : 
                    selectedVM.health === 'Fair' ? 'text-yellow-400' :
                    'text-cyber-red'
                  }`}>
                    {selectedVM.health}
                  </div>
                </div>
              </div>
              
              {/* Resources */}
              <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                <div className="text-sm text-cyber-teal mb-3">Resource Utilization</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-cyber-gray">CPU</span>
                      <span className="text-cyber-blue">{selectedVM.resources.cpu}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div 
                        className="h-full bg-cyber-blue" 
                        style={{ width: `${selectedVM.resources.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-cyber-gray">Memory</span>
                      <span className="text-cyber-green">{selectedVM.resources.memory}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div 
                        className="h-full bg-cyber-green" 
                        style={{ width: `${selectedVM.resources.memory}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-cyber-gray">Disk</span>
                      <span className="text-cyber-teal">{selectedVM.resources.disk}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div 
                        className="h-full bg-cyber-teal" 
                        style={{ width: `${selectedVM.resources.disk}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-cyber-gray">Network</span>
                      <span className="text-purple-400">{selectedVM.resources.network}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div 
                        className="h-full bg-purple-400" 
                        style={{ width: `${selectedVM.resources.network}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recovery */}
              <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-cyber-teal">Snapshot</div>
                    <div className="text-xs text-cyber-gray mt-1">Last: {selectedVM.last_snapshot}</div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                    onClick={() => handleCreateSnapshot(selectedVM.id)}
                    disabled={actionLoading === selectedVM.id}
                  >
                    {actionLoading === selectedVM.id ? (
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <HardDrive className="mr-2 h-4 w-4" />
                    )}
                    Create Snapshot
                  </Button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-2">
                {selectedVM.status === 'Running' ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                      onClick={() => handleVMAction(selectedVM.id, 'Stop')}
                      disabled={actionLoading === selectedVM.id}
                    >
                      {actionLoading === selectedVM.id ? (
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Power className="mr-2 h-4 w-4" />
                      )}
                      Stop
                    </Button>
                    <Button
                      className="cyber-button"
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </>
                ) : selectedVM.status === 'Paused' ? (
                  <Button
                    className="cyber-button"
                    onClick={() => handleVMAction(selectedVM.id, 'Resume')}
                    disabled={actionLoading === selectedVM.id}
                  >
                    {actionLoading === selectedVM.id ? (
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                      </svg>
                    )}
                    Resume
                  </Button>
                ) : (
                  <Button
                    className="cyber-button"
                    onClick={() => handleVMAction(selectedVM.id, 'Start')}
                    disabled={actionLoading === selectedVM.id}
                  >
                    {actionLoading === selectedVM.id ? (
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                      </svg>
                    )}
                    Start
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VirtualDesktopPage;
