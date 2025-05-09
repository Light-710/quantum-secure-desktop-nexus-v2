import api from './api';

export interface VMResponse {
  message: string;
  URL?: string;
}

export interface VMStatus {
  linux: string;
  windows: string;
}

export const vmService = {
  // This matches the API spec POST /vm/get-status and POST /admin/vm/vm-status
  getVMStatus: async (employeeId?: string): Promise<VMStatus> => {
    if (employeeId) {
      // Admin getting VM status for a specific user
      const formData = new FormData();
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/vm-status', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } else {
      // User getting their own VM status
      const response = await api.post('/vm/get-status', {}, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    }
  },

  // This matches the API spec POST /vm/start-vm and POST /admin/vm/start-vm
  startVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    
    if (employeeId) {
      // Admin starting VM for a specific user
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/start-vm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } else {
      // User starting their own VM
      const response = await api.post('/vm/start-vm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    }
  },

  // This matches the API spec POST /vm/stop-vm and POST /admin/vm/stop-vm
  stopVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    
    if (employeeId) {
      // Admin stopping VM for a specific user
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/stop-vm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } else {
      // User stopping their own VM
      const response = await api.post('/vm/stop-vm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    }
  },

  // This matches the API spec POST /vm/restart-vm and POST /admin/vm/restart-vm
  restartVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    
    if (employeeId) {
      // Admin restarting VM for a specific user
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/restart-vm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } else {
      // User restarting their own VM
      const response = await api.post('/vm/restart-vm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    }
  },

  // Add a create snapshot function
  createSnapshot: async (vmId: string): Promise<VMResponse> => {
    try {
      // Note: This endpoint is not specified in the API doc, but we'll keep it for UI functionality
      const response = await api.post('/vm/create-snapshot', { vm_id: vmId });
      return response.data;
    } catch (error: any) {
      console.error('Error creating snapshot:', error);
      throw error;
    }
  }
};
