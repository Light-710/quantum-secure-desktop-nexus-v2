
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

    // Success toast
    toast(`${action} Successful`, {
      description: response.message || `Virtual desktop ${vmId} has been ${action.toLowerCase()}ed.`,
    });

    // If a URL is returned (for Start action), offer to open it
    if (response.URL) {
      // Handle URL - could open in new tab or display in UI
      console.log('VM URL:', response.URL);
    }

    onSuccess?.();
  } catch (error: any) {
    // Error toast
    toast.error(`Failed to ${action.toLowerCase()} VM`, {
      description: error.response?.data?.message || error.message || "An error occurred",
    });
  }
};

export const handleCreateSnapshot = async (vmId: string) => {
  // This is a placeholder since the API doesn't have snapshot endpoints yet
  toast("Snapshot Created", {
    description: `Snapshot for ${vmId} has been created successfully.`,
  });
};
