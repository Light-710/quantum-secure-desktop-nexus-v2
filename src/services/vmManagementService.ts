
import { toast } from "@/components/ui/sonner";
import { vmService } from "./vmService";

// VM Types matching the API responses
export type VMStatus = 'Running' | 'Stopped' | 'Starting' | 'Stopping' | 'Paused' | 'Error';

export interface VMResources {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface VirtualMachine {
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

// Mock VMs for initial development until backend provides real data
export const mockVMs: VirtualMachine[] = [
  {
    id: 'vm-001',
    name: 'Windows Development',
    status: 'Running',
    os: 'Windows',
    assigned_user: 'emp-001',
    uptime: '12h 45m',
    health: 'Good',
    ip_address: '10.0.0.15',
    last_snapshot: '2025-04-15 09:30',
    resources: {
      cpu: 45,
      memory: 60,
      disk: 30,
      network: 25
    }
  },
  {
    id: 'vm-002',
    name: 'Linux Server',
    status: 'Stopped',
    os: 'Linux',
    assigned_user: 'emp-002',
    uptime: '0h 0m',
    health: 'Good',
    ip_address: '10.0.0.16',
    last_snapshot: '2025-04-14 17:15',
    resources: {
      cpu: 0,
      memory: 0,
      disk: 15,
      network: 0
    }
  }
];

// Function to handle VM actions (start, stop, restart) using the vmService
export const handleVMAction = async (vmId: string, action: string, instanceOs: string, employeeId: string) => {
  try {
    let response;
    
    switch (action.toLowerCase()) {
      case 'start':
        console.log(`Starting VM ${vmId} (${instanceOs}) for user ${employeeId}`);
        response = await vmService.startVM(instanceOs, employeeId);
        break;
      case 'stop':
        console.log(`Stopping VM ${vmId} (${instanceOs}) for user ${employeeId}`);
        response = await vmService.stopVM(instanceOs, employeeId);
        break;
      case 'restart':
      case 'reset':
        console.log(`Restarting VM ${vmId} (${instanceOs}) for user ${employeeId}`);
        response = await vmService.restartVM(instanceOs, employeeId);
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
    
    toast(`VM ${action} initiated`, {
      description: response.message || `The VM is now being ${action.toLowerCase()}ed.`
    });
    
    // If the action was successful and a URL was provided (for start actions)
    if (response.URL) {
      // You could either redirect or open in new tab
      // window.open(response.URL, '_blank');
    }
    
    return response;
  } catch (error: any) {
    console.error(`Error performing VM ${action}:`, error);
    toast.error(`VM ${action} Failed`, {
      description: error.response?.data?.message || `Failed to ${action.toLowerCase()} VM.`
    });
    throw error;
  }
};

// Function to simulate creating a VM snapshot
export const handleCreateSnapshot = (vmId: string) => {
  // This would be a real API call in a production environment
  toast('Creating Snapshot', {
    description: 'VM snapshot creation initiated.'
  });
  
  // Return a mock promise to simulate API behavior
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      toast('Snapshot Created', {
        description: 'VM snapshot completed successfully.'
      });
      resolve();
    }, 2000);
  });
};

// Load VMs for a specific user or all VMs for admin
export const loadUserVMs = async (employeeId?: string): Promise<VirtualMachine[]> => {
  try {
    // Get VM status from API
    const statusResponse = await vmService.getVMStatus(employeeId);
    console.log('VM status response:', statusResponse);
    
    // In a real implementation, you would transform the API response to VirtualMachine objects
    // For now, we'll return mock data that reflects the status from the API
    return mockVMs.map(vm => {
      // Update status based on API response
      if (vm.os.toLowerCase() === 'windows') {
        vm.status = statusResponse.windows as VMStatus;
      } else if (vm.os.toLowerCase() === 'linux') {
        vm.status = statusResponse.linux as VMStatus;
      }
      
      // If VM is stopped, zero out resource usage except disk
      if (vm.status === 'Stopped') {
        vm.resources = {
          ...vm.resources,
          cpu: 0,
          memory: 0,
          network: 0
        };
        vm.uptime = '0h 0m';
      }
      
      return vm;
    });
  } catch (error: any) {
    console.error('Error loading VMs:', error);
    toast.error('Error Loading VMs', {
      description: error.response?.data?.message || 'Failed to load virtual machines.'
    });
    return [];
  }
};
