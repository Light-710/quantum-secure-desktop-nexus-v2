
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { Monitor } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { handleVMAction, loadUserVMs, VirtualMachine } from '@/services/vmManagementService';
import { VMTableActions } from '@/components/vm/VMTableActions';
import { VMStatusBadge } from '@/components/vm/VMStatusBadge';
import { useAuth } from '@/contexts/AuthContext';

const ManagerVirtualDesktop = () => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConnectLink, setShowConnectLink] = useState<Record<string, boolean>>({});
  const [connectTimers, setConnectTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Fetch VMs for current user (manager)
  const { 
    data: vms = [], 
    isLoading: isLoadingVMs,
    refetch: refetchVMs
  } = useQuery({
    queryKey: ['manager-own-vms', user?.employee_id],
    queryFn: async () => {
      try {
        // We don't pass employeeId to get current user's VMs
        return await loadUserVMs();
      } catch (error) {
        console.error('Error fetching VMs for manager:', error);
        toast.error('Failed to load virtual machines');
        return [];
      }
    },
    enabled: !!user
  });

  // Handle VM action (start, stop, restart)
  const handleAction = async (vmId: string, action: string, instanceOs: string) => {
    const employeeId = user?.employee_id || '';
    setActionLoading(vmId);
    try {
      await handleVMAction(vmId, action, instanceOs, employeeId);
      
      // Clear any existing timer for this VM
      if (connectTimers[vmId]) {
        clearTimeout(connectTimers[vmId]);
      }
      
      // For start action, show a 1-minute loading state before showing connect link
      if (action.toLowerCase() === 'start') {
        toast(`Starting ${instanceOs} VM`, {
          description: 'Your virtual machine is starting. This may take about a minute.'
        });
        
        setShowConnectLink(prev => ({ ...prev, [vmId]: false }));
        
        const timer = setTimeout(() => {
          setShowConnectLink(prev => ({ ...prev, [vmId]: true }));
          toast(`${instanceOs} VM Ready`, {
            description: 'Your virtual machine is now ready to connect.'
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

  // Clear all timers on unmount
  useEffect(() => {
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
          <CardTitle className="text-2xl text-warm-300">My Virtual Desktop</CardTitle>
          <CardDescription className="text-warm-100/70">
            Manage your personal virtual machines
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
                        employeeId={user?.employee_id || ''}
                        actionLoading={actionLoading === vm.id ? vm.id : null}
                        onAction={(vmId, action, os, employeeId) => handleAction(vmId, action, os)}
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
              No virtual machines available
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ManagerVirtualDesktop;
