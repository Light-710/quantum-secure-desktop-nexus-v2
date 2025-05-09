
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Monitor, Server, Clock, Plus } from 'lucide-react';
import { VMStatusBadge } from '@/components/vm/VMStatusBadge';
import { VMDetailsDialog } from '@/components/vm/VMDetailsDialog';
import { VMTableActions } from '@/components/vm/VMTableActions';
import { toast } from '@/components/ui/sonner';
import { vmService } from '@/services/vmService';
import { VMStatus, VirtualMachine as ManagementVirtualMachine } from '@/services/vmManagementService';

// Define interfaces for VM data
interface VMResources {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface VirtualMachine {
  id: string;
  name: string;
  status: VMStatus;
  os: string;
  assigned_user: string;
  uptime: string;
  health: string;
  ip_address: string;
  last_snapshot?: string;
  resources: VMResources;
}

const VirtualDesktopPage = () => {
  const [vms, setVMs] = useState<VirtualMachine[]>([]);
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleViewDetails = (vm: VirtualMachine) => {
    setSelectedVM(vm);
    setIsDetailsOpen(true);
  };

  // Calculate stats
  const runningVMs = vms.filter(vm => vm.status === 'Running').length;
  const totalCPUUsage = vms.reduce((sum, vm) => sum + vm.resources.cpu, 0) / (vms.length || 1);
  const totalMemoryUsage = vms.reduce((sum, vm) => sum + vm.resources.memory, 0) / (vms.length || 1);
  const vmsByOs = {
    Windows: vms.filter(vm => vm.os === 'Windows').length,
    Linux: vms.filter(vm => vm.os === 'Linux').length,
    Other: vms.filter(vm => vm.os === 'Other').length,
  };

  const handleAction = async (vmId: string, action: string, instanceOs: string, employeeId: string) => {
    setActionLoading(vmId);
    
    try {
      let response;
      
      switch (action.toLowerCase()) {
        case 'start':
          response = await vmService.startVM(instanceOs, employeeId);
          break;
        case 'stop':
          response = await vmService.stopVM(instanceOs, employeeId);
          break;
        case 'restart':
          response = await vmService.restartVM(instanceOs, employeeId);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
      toast(`VM ${action} Successful`, {
        description: response.message || `The VM has been ${action.toLowerCase()}ed.`
      });
      
      // Refresh VM list after action
      loadVMs();
    } catch (error: any) {
      toast.error(`VM ${action} Failed`, {
        description: error.response?.data?.message || `Failed to ${action.toLowerCase()} VM.`
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Load VM data from API
  const loadVMs = async () => {
    try {
      // This is a placeholder for a real API call that would fetch VM data
      // In a real implementation, you would make an API call here and transform the response
      // Since there's no specific VM listing endpoint in the API spec, 
      // we'll leave this as a placeholder for now
      setVMs([]);
    } catch (error: any) {
      toast.error('Error loading VMs', {
        description: error.message || 'Failed to load virtual machines.'
      });
    }
  };

  useEffect(() => {
    loadVMs();
  }, []);

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
            {/* Running VMs Card */}
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

            {/* CPU Usage Card */}
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Avg CPU Usage</p>
                    <h3 className="text-3xl font-bold text-cyber-green mt-1">
                      {totalCPUUsage.toFixed(1)}%
                    </h3>
                  </div>
                  <div className="bg-cyber-green/10 p-3 rounded-full">
                    <Server className="h-6 w-6 text-cyber-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage Card */}
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Avg Memory Usage</p>
                    <h3 className="text-3xl font-bold text-cyber-purple mt-1">
                      {totalMemoryUsage.toFixed(1)}%
                    </h3>
                  </div>
                  <div className="bg-cyber-purple/10 p-3 rounded-full">
                    <Server className="h-6 w-6 text-cyber-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OS Distribution Card */}
            <Card className="glass-panel border-cyber-teal/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">OS Distribution</p>
                    <div className="flex space-x-2 mt-1">
                      <p className="text-xs"><span className="font-bold text-blue-500">Win:</span> {vmsByOs.Windows}</p>
                      <p className="text-xs"><span className="font-bold text-yellow-500">Lin:</span> {vmsByOs.Linux}</p>
                      <p className="text-xs"><span className="font-bold text-purple-500">Other:</span> {vmsByOs.Other}</p>
                    </div>
                  </div>
                  <div className="bg-cyber-teal/10 p-3 rounded-full">
                    <Monitor className="h-6 w-6 text-cyber-teal" />
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
                {vms.length > 0 ? (
                  vms.map((vm) => (
                    <TableRow key={vm.id} className={`hover:bg-cyber-dark-blue/20 ${
                      vm.status === 'Error' ? 'bg-cyber-red/5' : ''
                    }`}>
                      {/* VM Info */}
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

                      {/* Status */}
                      <TableCell>
                        <VMStatusBadge status={vm.status} />
                      </TableCell>

                      {/* Other cells */}
                      <TableCell className="text-sm text-cyber-gray">{vm.assigned_user}</TableCell>
                      <TableCell className="text-sm text-cyber-gray">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} className="text-cyber-blue" />
                          <span>{vm.uptime}</span>
                        </div>
                      </TableCell>

                      {/* Resources */}
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

                      {/* Health */}
                      <TableCell>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          vm.health === 'Good' ? 'bg-green-400/20 text-green-400' : 
                          vm.health === 'Fair' ? 'bg-yellow-400/20 text-yellow-400' :
                          'bg-cyber-red/20 text-cyber-red'
                        }`}>
                          {vm.health}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <VMTableActions
                          vmId={vm.id}
                          status={vm.status}
                          instanceOs={vm.os.toLowerCase()}
                          employeeId={vm.assigned_user}
                          actionLoading={actionLoading}
                          onAction={handleAction}
                          onViewDetails={() => handleViewDetails(vm)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No virtual machines available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* VM Details Dialog */}
      {selectedVM && (
        <VMDetailsDialog
          vm={selectedVM as unknown as ManagementVirtualMachine}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          actionLoading={actionLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default VirtualDesktopPage;
