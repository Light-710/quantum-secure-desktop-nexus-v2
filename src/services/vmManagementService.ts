import api from './api';

export type VMStatus = 'Running' | 'Starting' | 'Stopping' | 'Stopped' | 'Error';
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
    network: number; // Added network property
  };
  ip_address: string; // Added ip_address property
  last_snapshot: string; // Added last_snapshot property
}

export interface VMActionResponse {
  message: string;
  URL?: string;
}

export interface VMStatusResponse {
  windows: string;
  linux: string;
}

// For admin VM operations
export const adminVmService = {
  startVM: async (employee_id: string, instance_os: string): Promise<VMActionResponse> => {
    const formData = new FormData();
    formData.append('employee_id', employee_id);
    formData.append('instance_os', instance_os);

    const response = await api.post('/admin/vm/start-vm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  stopVM: async (employee_id: string, instance_os: string): Promise<VMActionResponse> => {
    const formData = new FormData();
    formData.append('employee_id', employee_id);
    formData.append('instance_os', instance_os);

    const response = await api.post('/admin/vm/stop-vm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  restartVM: async (employee_id: string, instance_os: string): Promise<VMActionResponse> => {
    const formData = new FormData();
    formData.append('employee_id', employee_id);
    formData.append('instance_os', instance_os);

    const response = await api.post('/admin/vm/restart-vm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getVMStatus: async (employee_id: string): Promise<VMStatusResponse> => {
    const formData = new FormData();
    formData.append('employee_id', employee_id);

    const response = await api.post('/admin/vm/vm-status', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// For user VM operations
export const userVmService = {
  startVM: async (instance_os: string): Promise<VMActionResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instance_os);

    const response = await api.post('/vm/start-vm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  stopVM: async (instance_os: string): Promise<VMActionResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instance_os);

    const response = await api.post('/vm/stop-vm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  restartVM: async (instance_os: string): Promise<VMActionResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instance_os);

    const response = await api.post('/vm/restart-vm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getVMStatus: async (): Promise<VMStatusResponse> => {
    const response = await api.post('/vm/get-status', {}, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Add the missing handleCreateSnapshot function
export const handleCreateSnapshot = async (vmId: string) => {
  try {
    const response = await api.post('/vm/create-snapshot', { vm_id: vmId });
    return response.data;
  } catch (error: any) {
    console.error('Error creating snapshot:', error);
    throw error;
  }
};

export const handleVMAction = async (
  vmId: string,
  action: 'Start' | 'Stop' | 'Reset' | 'Resume', // Added Resume action
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
        response = await adminVmService.startVM(employeeId, instanceOs);
      } else if (action === 'Stop') {
        response = await adminVmService.stopVM(employeeId, instanceOs);
      } else if (action === 'Reset') {
        response = await adminVmService.restartVM(employeeId, instanceOs);
      } else if (action === 'Resume') {
        // Handle resume action (similar to start but potentially different endpoint)
        response = await adminVmService.startVM(employeeId, instanceOs);
      }
    } else {
      // User actions
      if (action === 'Start') {
        response = await userVmService.startVM(instanceOs);
      } else if (action === 'Stop') {
        response = await userVmService.stopVM(instanceOs);
      } else if (action === 'Reset') {
        response = await userVmService.restartVM(instanceOs);
      } else if (action === 'Resume') {
        // Handle resume action
        response = await userVmService.startVM(instanceOs);
      }
    }
    
    if (onComplete) onComplete();
    
    // Show toast or other notification here
    
    return response;
  } catch (error: any) {
    console.error(`Error ${action.toLowerCase()}ing VM:`, error);
    
    // Show error toast or other notification here
    
    throw error;
  }
};
