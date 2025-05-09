
import { toast } from "sonner";

// Virtual Machine types
export type VMStatus = 'Running' | 'Stopped' | 'Error' | 'Maintenance' | 'Starting' | 'Stopping';
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
  action: 'Start' | 'Stop' | 'Restart' | 'Snapshot' | 'Reset',
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

// VM management API service
const vmManagementService = {
  // Get all virtual desktops
  getAllVirtualDesktops: async (): Promise<VirtualMachine[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock data
    return [
      {
        id: "vm1",
        name: "Windows Server",
        status: "Running",
        os: "Windows",
        assigned_user: "john.doe",
        uptime: "2d 5h 30m",
        health: "Good",
        ip_address: "192.168.1.100",
        last_snapshot: "2023-05-15 14:30",
        resources: {
          cpu: 25,
          memory: 40,
          disk: 60,
          network: 15
        }
      },
      {
        id: "vm2",
        name: "Ubuntu Dev",
        status: "Stopped",
        os: "Linux",
        assigned_user: "jane.smith",
        uptime: "0",
        health: "Good",
        ip_address: "192.168.1.101",
        last_snapshot: "2023-05-10 09:15",
        resources: {
          cpu: 0,
          memory: 0,
          disk: 30,
          network: 0
        }
      },
      {
        id: "vm3",
        name: "Kali Linux",
        status: "Running",
        os: "Linux",
        assigned_user: "security.team",
        uptime: "5d 12h 45m",
        health: "Fair",
        ip_address: "192.168.1.102",
        last_snapshot: "2023-05-12 10:00",
        resources: {
          cpu: 80,
          memory: 60,
          disk: 45,
          network: 30
        }
      }
    ];
  },

  // Create new virtual desktop
  createVirtualDesktop: async (data: any): Promise<VirtualMachine> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      toast.error("Failed to create VM", {
        description: "An error occurred while creating the VM.",
      });
      throw new Error("Failed to create VM");
    }

    // Mock response
    return {
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
  }
};

export default vmManagementService;
