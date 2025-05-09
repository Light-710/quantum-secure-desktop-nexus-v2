
import api from './api';
import { vmService } from './vmService';
import { toast } from '@/components/ui/sonner';

export type VMStatus = 'Running' | 'Starting' | 'Stopping' | 'Stopped' | 'Error' | 'Paused';
export type VMHealth = 'Good' | 'Fair' | 'Poor';
export type VMOsType = 'Windows' | 'Linux' | 'Other';

export interface VirtualMachine {
  id: string;
  name: string;
  status: VMStatus;
  os: VMOsType;
  assigned_user: string;
  uptime: string;
  health: VMHealth;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  ip_address: string;
  last_snapshot: string;
}

export interface VMActionResponse {
  message: string;
  URL?: string;
}

// Create snapshot function as it appears in the VM details dialog
export const handleCreateSnapshot = async (vmId: string) => {
  try {
    const response = await vmService.createSnapshot(vmId);
    toast("Snapshot Created", {
      description: "Virtual machine snapshot has been created successfully",
    });
    return response;
  } catch (error: any) {
    toast("Error Creating Snapshot", {
      description: error.response?.data?.message || "Failed to create snapshot",
      variant: "destructive",
    });
    throw error;
  }
};

// Handle VM Actions
export const handleVMAction = async (
  vmId: string,
  action: 'Start' | 'Stop' | 'Reset' | 'Resume',
  instanceOs: string,
  employeeId: string,
  onComplete?: () => void
) => {
  try {
    let response;
    
    // Determine if this is an admin action or user action
    const isAdmin = localStorage.getItem('ptng_user') ? 
      JSON.parse(localStorage.getItem('ptng_user') || '{}').role === 'Admin' : 
      false;
    
    if (isAdmin) {
      // Admin actions
      if (action === 'Start') {
        response = await vmService.startVM(instanceOs, employeeId);
      } else if (action === 'Stop') {
        response = await vmService.stopVM(instanceOs, employeeId);
      } else if (action === 'Reset') {
        response = await vmService.restartVM(instanceOs, employeeId);
      } else if (action === 'Resume') {
        // Handle resume action (similar to start)
        response = await vmService.startVM(instanceOs, employeeId);
      }
    } else {
      // User actions
      if (action === 'Start') {
        response = await vmService.startVM(instanceOs);
      } else if (action === 'Stop') {
        response = await vmService.stopVM(instanceOs);
      } else if (action === 'Reset') {
        response = await vmService.restartVM(instanceOs);
      } else if (action === 'Resume') {
        // Handle resume action
        response = await vmService.startVM(instanceOs);
      }
    }
    
    // Show success toast notification
    toast(`VM ${action} Initiated`, {
      description: response?.message || `VM ${action.toLowerCase()} process has started`,
    });
    
    if (onComplete) onComplete();
    
    return response;
  } catch (error: any) {
    console.error(`Error ${action.toLowerCase()}ing VM:`, error);
    
    // Show error toast notification
    toast(`VM ${action} Failed`, {
      description: error.response?.data?.message || `Failed to ${action.toLowerCase()} VM`,
      variant: "destructive",
    });
    
    throw error;
  }
};
