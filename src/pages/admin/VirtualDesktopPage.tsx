
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Monitor, Server, Clock, Plus, RefreshCw } from 'lucide-react';
import { VMStatusBadge } from '@/components/vm/VMStatusBadge';
import { VMDetailsDialog } from '@/components/vm/VMDetailsDialog';
import { VMTableActions } from '@/components/vm/VMTableActions';
import { toast } from '@/components/ui/sonner';
import { vmService } from '@/services/vmService';
import { 
  VirtualMachine,
  VMStatus,
  loadUserVMs,
  handleVMAction,
  mockVMs
} from '@/services/vmManagementService';

const VirtualDesktopPage = () => {
  const [vms, setVMs] = useState<VirtualMachine[]>([]);
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleViewDetails = (vm: VirtualMachine) => {
    setSelectedVM(vm);
    setIsDetailsOpen(true);
  };

  // Calculate stats
  const runningVMs = vms.filter(vm => vm.status === 'Running').length;
  const totalCPUUsage = vms.reduce((sum, vm) => sum + vm.resources.cpu, 0) / (vms.length || 1);
  const totalMemoryUsage = vms.reduce((sum, vm) => sum + vm.resources.memory, 0) / (vms.length || 1);
  const vmsByOs = {
    Windows: vms.filter(vm => vm.os.toLowerCase() === 'windows').length,
    Linux: vms.filter(vm => vm.os.toLowerCase() === 'linux').length,
    Other: vms.filter(vm => !['windows', 'linux'].includes(vm.os.toLowerCase())).length,
  };

  const handleAction = async (vmId: string, action: string, instanceOs: string, employeeId: string) => {
    setActionLoading(vmId);
    
    try {
      await handleVMAction(vmId, action, instanceOs, employeeId);
      
      // Refresh VM list after action
      await loadVMs();
    } catch (error) {
      console.error(`Error executing VM action:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  // Load VM data from API
  const loadVMs = async () => {
    setIsLoading(true);
    try {
      // Load VMs without specific employee_id to get all VMs (admin view)
      const loadedVMs = await loadUserVMs();
      setVMs(loadedVMs);
    } catch (error: any) {
      toast.error('Error loading VMs', {
        description: error.message || 'Failed to load virtual machines.'
      });
      // Fallback to mock data in case of error
      setVMs(mockVMs);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadVMs();
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
          <div className="flex gap-2">
            <Button 
              className="cyber-button" 
              size="sm" 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="cyber-button">
              <Plus className="mr-2 h-4 w-4" /> New VM
            </Button>
          </div>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex justify-center">
                        <div className="animate-spin h-8 w-8 border-2 border-cyber-teal border-t-transparent rounded-full"></div>
                      </div>
                      <div className="mt-2 text-cyber-gray">Loading virtual machines...</div>
                    </TableCell>
                  </TableRow>
                ) : vms.length > 0 ? (
                  vms.map((vm) => (
                    <TableRow key={vm.id} className={`hover:bg-cyber-dark-blue/20 ${
                      vm.status === 'Error' ? 'bg-cyber-red/5' : ''
                    }`}>
                      {/* VM Info */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white border ${
                              vm.os.toLowerCase() === 'windows' ? 'bg-blue-500/20 border-blue-500/30' : 
                              vm.os.toLowerCase() === 'linux' ? 'bg-yellow-500/20 border-yellow-500/30' : 
                              'bg-purple-500/20 border-purple-500/30'
                            }`}>
                              {vm.os.substring(0, 1).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <button 
                              className="text-sm font-medium text-cyber-teal hover:text-cyber-blue"
                              onClick={() => handleViewDetails(vm)}
                            >
                              {vm.name}
                            </button>
                            <div className="text-xs text-cyber-gray">{vm.instance_id || vm.id}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <VMStatusBadge status={vm.status} />
                      </TableCell>

                      {/* User information */}
                      <TableCell className="text-sm text-cyber-gray">
                        <div>
                          <div>{vm.user_name || 'N/A'}</div>
                          <div className="text-xs opacity-70">{vm.assigned_user}</div>
                        </div>
                      </TableCell>
                      
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
                          guacamoleUrl={vm.guacamole_url}
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
          vm={selectedVM}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          actionLoading={actionLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default VirtualDesktopPage;
