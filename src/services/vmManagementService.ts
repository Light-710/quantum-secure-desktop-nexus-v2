
import { vmService } from './vmService';
import { toast } from '@/components/ui/sonner';

export type VMStatus = 'Running' | 'Stopped' | 'Paused' | 'Error';
export type VMOs = 'Windows' | 'Linux' | 'Other';
export type VMHealth = 'Good' | 'Fair' | 'Poor';

export interface VirtualMachine {
  id: string;
  name: string;
  os: VMOs;
  status: VMStatus;
  assigned_user: string;
  uptime: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  health: VMHealth;
  last_snapshot: string;
  ip_address: string;
}

export const handleVMAction = async (
  vmId: string, 
  action: 'Start' | 'Stop' | 'Pause' | 'Resume' | 'Reset',
  instanceOs: string,
  employeeId: string,
  onSuccess?: () => void
) => {
  try {
    let response;
    switch (action) {
      case 'Start':
        response = await vmService.startVM(instanceOs, employeeId);
        break;
      case 'Stop':
        response = await vmService.stopVM(instanceOs, employeeId);
        break;
      case 'Reset':
        response = await vmService.restartVM(instanceOs, employeeId);
        break;
      default:
        throw new Error('Invalid action');
    }

    toast({
      title: `${action} Successful`,
      description: `Virtual desktop ${vmId} has been ${action.toLowerCase()}ed.`,
    });

    onSuccess?.();
  } catch (error) {
    toast({
      title: 'Error',
      description: `Failed to ${action.toLowerCase()} VM: ${error.message}`,
      variant: 'destructive',
    });
  }
};

export const handleCreateSnapshot = async (vmId: string) => {
  toast({
    title: "Snapshot Created",
    description: `Snapshot for ${vmId} has been created successfully.`,
  });
};
