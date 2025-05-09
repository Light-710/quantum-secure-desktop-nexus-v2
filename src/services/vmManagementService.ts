
import { toast } from "sonner";

// Virtual Machine types
export type VMStatus = 'Running' | 'Stopped' | 'Error' | 'Maintenance' | 'Starting' | 'Stopping' | 'Paused';
export type VMOs = 'Windows' | 'Linux' | 'Other';

export interface VirtualMachine {
  id: string;
  name: string;
  status: VMStatus;
  os: VMOs;
  assigned_user: string;
  uptime: string;
  health: 'Good' | 'Fair' | 'Poor';
  ip_address: string;
  last_snapshot: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

// Handle VM action
export const handleVMAction = async (
  vmId: string,
  action: 'Start' | 'Stop' | 'Restart' | 'Snapshot' | 'Reset' | 'Resume',
  instanceOs: string,
  employeeId: string,
  onSuccess?: () => void
) => {
  try {
    // In a real app, this would call an API endpoint to perform the action
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    toast.success(`VM ${action} Command Sent`, {
      description: `Request to ${action.toLowerCase()} VM ${vmId} has been sent.`,
    });
    
    onSuccess?.();
    return { success: true, message: `VM ${action} command sent` };
  } catch (error) {
    toast.error(`VM ${action} Failed`, {
      description: `Could not ${action.toLowerCase()} the VM. Please try again later.`,
    });
    throw error;
  }
};

// Create snapshot function
export const handleCreateSnapshot = async (
  vmId: string,
  onSuccess?: () => void
) => {
  try {
    // In a real app, this would call an API endpoint to create a snapshot
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    toast.success("Snapshot Creation Initiated", {
      description: "VM snapshot creation request has been sent.",
    });
    
    onSuccess?.();
    return { success: true, message: "Snapshot creation initiated" };
  } catch (error) {
    toast.error("Snapshot Creation Failed", {
      description: "Could not create snapshot. Please try again later.",
    });
    throw error;
  }
};

// VM management API service
const vmManagementService = {
  // Get all virtual desktops
  getAllVirtualDesktops: async (): Promise<VirtualMachine[]> => {
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return [];
    } catch (error) {
      console.error('Error fetching virtual desktops:', error);
      return [];
    }
  },

  // Create new virtual desktop
  createVirtualDesktop: async (data: any): Promise<VirtualMachine> => {
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Return a basic VM structure with empty/default values
      const newVM: VirtualMachine = {
        id: `vm-${Date.now()}`,
        name: data.name || "New VM",
        status: "Starting",
        os: data.os || "Windows",
        assigned_user: data.assigned_user || "",
        uptime: "0",
        health: "Good",
        ip_address: "",
        last_snapshot: "N/A",
        resources: {
          cpu: 0,
          memory: 0,
          disk: 0,
          network: 0
        }
      };
      
      return newVM;
    } catch (error) {
      console.error('Error creating virtual desktop:', error);
      throw error;
    }
  }
};

export default vmManagementService;
