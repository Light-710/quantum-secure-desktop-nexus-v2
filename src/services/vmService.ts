
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
  getVMStatus: async (employeeId?: string): Promise<VMStatus> => {
    if (employeeId) {
      // Admin getting VM status for a specific user
      const formData = new FormData();
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/vm-status', formData);
      return response.data;
    } else {
      // User getting their own VM status
      const response = await api.post('/vm/get-status');
      return response.data;
    }
  },

  startVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    
    if (employeeId) {
      // Admin starting VM for a specific user
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/start-vm', formData);
      return response.data;
    } else {
      // User starting their own VM
      const response = await api.post('/vm/start-vm', formData);
      return response.data;
    }
  },

  stopVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    
    if (employeeId) {
      // Admin stopping VM for a specific user
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/stop-vm', formData);
      return response.data;
    } else {
      // User stopping their own VM
      const response = await api.post('/vm/stop-vm', formData);
      return response.data;
    }
  },

  restartVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    
    if (employeeId) {
      // Admin restarting VM for a specific user
      formData.append('employee_id', employeeId);
      const response = await api.post('/admin/vm/restart-vm', formData);
      return response.data;
    } else {
      // User restarting their own VM
      const response = await api.post('/vm/restart-vm', formData);
      return response.data;
    }
  },
};
