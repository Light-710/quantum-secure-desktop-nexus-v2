
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

// Mock implementation of VM action handling
export const handleVMAction = async (
  vmId: string,
  action: 'Start' | 'Stop' | 'Restart' | 'Snapshot' | 'Reset' | 'Resume',
  instanceOs: string,
  employeeId: string,
  onSuccess?: () => void
) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Random success (90% chance)
  const isSuccess = Math.random() > 0.1;

  if (!isSuccess) {
    toast.error(`VM ${action} Failed`, {
      description: `Could not ${action.toLowerCase()} the VM. Please try again later.`,
    });
    throw new Error(`Failed to ${action.toLowerCase()} VM`);
  }

  // If successful
  onSuccess?.();
  return { success: true, message: `VM ${action} successful` };
};

// Added handleCreateSnapshot function
export const handleCreateSnapshot = async (
  vmId: string,
  onSuccess?: () => void
) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Random success (90% chance)
  const isSuccess = Math.random() > 0.1;

  if (!isSuccess) {
    toast.error("Snapshot Creation Failed", {
      description: "Could not create snapshot. Please try again later.",
    });
    throw new Error("Failed to create snapshot");
  }

  // If successful
  toast.success("Snapshot Created", {
    description: "VM snapshot has been created successfully.",
  });
  
  onSuccess?.();
  return { success: true, message: "Snapshot created successfully" };
};

// VM management API service
const vmManagementService = {
  // Get all virtual desktops
  getAllVirtualDesktops: async (): Promise<VirtualMachine[]> => {
    // Empty implementation
    return [];
  },

  // Create new virtual desktop
  createVirtualDesktop: async (data: any): Promise<VirtualMachine> => {
    // Empty implementation
    const newVM: VirtualMachine = {
      id: `vm${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      status: "Starting",
      os: data.os,
      assigned_user: data.assigned_user,
      uptime: "0",
      health: "Good",
      ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
      last_snapshot: "N/A",
      resources: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0
      }
    };
    return newVM;
  }
};

export default vmManagementService;
