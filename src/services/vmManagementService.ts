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
  user_name?: string;
  user_email?: string;
  guacamole_url?: string;
  instance_id?: string;
  created_at?: string;
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

// Function to convert API VM data to our app's format
const convertApiVMToAppFormat = (apiVM: any): VirtualMachine => {
  // Calculate uptime based on updated_at timestamp (simple implementation, can be improved)
  const updatedAt = new Date(apiVM.updated_at);
  const now = new Date();
  const uptimeMs = apiVM.status.toLowerCase() === 'running' ? 
    now.getTime() - updatedAt.getTime() : 0;
  
  const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const uptime = `${hours}h ${minutes}m`;
  
  // Default resource usage based on status
  const isRunning = apiVM.status.toLowerCase() === 'running';
  
  return {
    id: apiVM.instance_id || `vm-${apiVM.id}`,
    name: `${apiVM.instance_os} VM`,
    status: apiVM.status as VMStatus,
    os: apiVM.instance_os,
    assigned_user: apiVM.employee_id,
    uptime: uptime,
    health: 'Good', // Default health status
    ip_address: '10.0.0.15', // Placeholder IP address
    user_name: apiVM.user_name,
    user_email: apiVM.user_email,
    guacamole_url: apiVM.guacamole_url,
    instance_id: apiVM.instance_id,
    created_at: apiVM.created_at,
    resources: {
      cpu: isRunning ? Math.floor(Math.random() * 60) + 20 : 0, // Random CPU usage between 20-80% if running
      memory: isRunning ? Math.floor(Math.random() * 50) + 30 : 0, // Random memory usage between 30-80% if running
      disk: Math.floor(Math.random() * 40) + 10, // Random disk usage between 10-50%
      network: isRunning ? Math.floor(Math.random() * 40) + 5 : 0, // Random network usage between 5-45% if running
    }
  };
};

// Load VMs for a specific user or all VMs for admin
export const loadUserVMs = async (employeeId?: string): Promise<VirtualMachine[]> => {
  try {
    if (employeeId) {
      // Get VM status from API for a specific user
      const statusResponse = await vmService.getVMStatus(employeeId);
      console.log('VM status response for user:', statusResponse);
      
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
    } else {
      // Get all VMs for admin view
      try {
        const response = await vmService.getAllVMs();
        console.log('All VMs API response:', response);
        
        if (response && response.vms && Array.isArray(response.vms)) {
          return response.vms.map(vm => convertApiVMToAppFormat(vm));
        } else {
          console.error('Unexpected API response format:', response);
          toast.error('Unexpected API response format');
          return mockVMs;
        }
      } catch (error) {
        console.error('Error fetching all VMs:', error);
        toast.error('Failed to fetch VMs data');
        return mockVMs;
      }
    }
  } catch (error: any) {
    console.error('Error loading VMs:', error);
    toast.error('Error Loading VMs', {
      description: error.response?.data?.message || 'Failed to load virtual machines.'
    });
    return mockVMs;
  }
};
