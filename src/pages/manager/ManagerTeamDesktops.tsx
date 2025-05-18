
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { Monitor, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { handleVMAction, loadUserVMs, VirtualMachine } from '@/services/vmManagementService';
import { VMTableActions } from '@/components/vm/VMTableActions';
import { VMStatusBadge } from '@/components/vm/VMStatusBadge';
import { userManagementService } from '@/services/userManagementService';
import { useAuth } from '@/contexts/AuthContext';

const ManagerTeamDesktops = () => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTester, setSelectedTester] = useState<string | null>(null);
  const [showConnectLink, setShowConnectLink] = useState<Record<string, boolean>>({});
  const [connectTimers, setConnectTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Fetch team members (testers)
  const { data: testers = [], isLoading: isLoadingTesters } = useQuery({
    queryKey: ['testers'],
    queryFn: async () => {
      try {
        const response = await userManagementService.getAllTesters();
        return response;
      } catch (error) {
        console.error('Error fetching testers:', error);
        toast.error('Failed to load team members');
        return [];
      }
    }
  });

  // Fetch VMs for selected tester
  const { 
    data: vms = [], 
    isLoading: isLoadingVMs,
    refetch: refetchVMs
  } = useQuery({
    queryKey: ['manager-vms', selectedTester],
    queryFn: async () => {
      if (!selectedTester) return [];
      try {
        return await loadUserVMs(selectedTester);
      } catch (error) {
        console.error('Error fetching VMs for tester:', error);
        toast.error('Failed to load virtual machines');
        return [];
      }
    },
    enabled: !!selectedTester
  });

  // Handle VM action (start, stop, restart)
  const handleAction = async (vmId: string, action: string, instanceOs: string, employeeId: string) => {
    setActionLoading(vmId);
    try {
      await handleVMAction(vmId, action, instanceOs, employeeId);
      
      // Clear any existing timer
      if (connectTimers[vmId]) {
        clearTimeout(connectTimers[vmId]);
      }
      
      // If action is Start, show toast and set a 1-minute timer before showing connect link
      if (action.toLowerCase() === 'start') {
        toast(`Starting ${instanceOs} VM`, {
          description: "The team member's virtual machine is starting. This may take about a minute."
        });
        
        setShowConnectLink(prev => ({ ...prev, [vmId]: false }));
        
        const timer = setTimeout(() => {
          setShowConnectLink(prev => ({ ...prev, [vmId]: true }));
          toast(`${instanceOs} VM Ready`, {
            description: "The team member's virtual machine is now ready to connect."
          });
          delete connectTimers[vmId];
        }, 60000); // 60 seconds = 1 minute
        
        setConnectTimers(prev => ({ ...prev, [vmId]: timer }));
      }
      
      // Refresh VM data after action
      await refetchVMs();
    } catch (error) {
      console.error(`Error ${action} VM:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  // Clean up timers when component unmounts
  React.useEffect(() => {
    return () => {
      Object.values(connectTimers).forEach(timer => clearTimeout(timer));
    };
  }, [connectTimers]);

  const handleViewDetails = (vm: VirtualMachine) => {
    toast(`VM Details: ${vm.name}`, {
      description: `OS: ${vm.os}, Status: ${vm.status}, ID: ${vm.id}`
    });
  };

  return (
    <DashboardLayout>
      <Card className="glass-panel border-warm-100/30 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-warm-300">Team Virtual Desktops</CardTitle>
          <CardDescription className="text-warm-100/70">
            Manage and monitor your team's virtual machines
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-panel border-warm-100/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl text-warm-300">
              <Users className="mr-2 text-warm-200" size={20} />
              Select Team Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTesters ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin h-8 w-8 border-2 border-warm-300 border-t-transparent rounded-full"></div>
              </div>
            ) : testers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {testers.map((tester) => (
                  <Button
                    key={tester.employee_id}
                    variant={selectedTester === tester.employee_id ? "default" : "outline"}
                    onClick={() => setSelectedTester(tester.employee_id)}
                    className="border-warm-100/30"
                  >
                    {tester.name}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-warm-100/70">
                No team members found
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTester && (
          <Card className="glass-panel border-warm-100/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl text-warm-300">
                <Monitor className="mr-2 text-warm-200" size={20} />
                Virtual Machines
              </CardTitle>
              <CardDescription className="text-warm-100/70">
                {testers.find(t => t.employee_id === selectedTester)?.name}'s virtual desktops
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingVMs ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin h-8 w-8 border-2 border-warm-300 border-t-transparent rounded-full"></div>
                </div>
              ) : vms.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VM</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vms.map((vm) => (
                      <TableRow key={vm.id}>
                        <TableCell className="font-medium">{vm.name}</TableCell>
                        <TableCell>{vm.os}</TableCell>
                        <TableCell>
                          <VMStatusBadge status={vm.status} />
                        </TableCell>
                        <TableCell>
                          <VMTableActions
                            vmId={vm.id}
                            status={vm.status}
                            instanceOs={vm.os}
                            employeeId={selectedTester}
                            actionLoading={actionLoading === vm.id ? vm.id : null}
                            onAction={handleAction}
                            onViewDetails={() => handleViewDetails(vm)}
                            guacamoleUrl={
                              vm.status.toLowerCase() === 'running' && 
                              vm.guacamole_url && 
                              showConnectLink[vm.id] ? vm.guacamole_url : undefined
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-4 text-warm-100/70">
                  No virtual machines available for this user
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManagerTeamDesktops;
