
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
    const endpoint = employeeId ? '/admin/vm/vm-status' : '/vm/get-status';
    const formData = new FormData();
    if (employeeId) {
      formData.append('employee_id', employeeId);
    }
    const response = await api.post(endpoint, formData);
    return response.data;
  },

  startVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const endpoint = employeeId ? '/admin/vm/start-vm' : '/vm/start-vm';
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    if (employeeId) {
      formData.append('employee_id', employeeId);
    }
    const response = await api.post(endpoint, formData);
    return response.data;
  },

  stopVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const endpoint = employeeId ? '/admin/vm/stop-vm' : '/vm/stop-vm';
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    if (employeeId) {
      formData.append('employee_id', employeeId);
    }
    const response = await api.post(endpoint, formData);
    return response.data;
  },

  restartVM: async (instanceOs: string, employeeId?: string): Promise<VMResponse> => {
    const endpoint = employeeId ? '/admin/vm/restart-vm' : '/vm/restart-vm';
    const formData = new FormData();
    formData.append('instance_os', instanceOs);
    if (employeeId) {
      formData.append('employee_id', employeeId);
    }
    const response = await api.post(endpoint, formData);
    return response.data;
  },
};
