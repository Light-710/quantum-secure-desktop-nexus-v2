
import api from './api';
import type { User, UserFormValues } from '@/types/user';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/user/get-users');
    return response.data.users;
  },

  createUser: async (userData: UserFormValues) => {
    // Adapt to match API spec which expects employee_id
    const payload = {
      employee_id: userData.username, // Using username as employee_id
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    const response = await api.post('/admin/user/create-user', payload);
    return response.data;
  },

  updateUser: async (employee_id: string, userData: UserFormValues) => {
    // Adapt to match API spec
    const payload = {
      employee_id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    const response = await api.put('/admin/user/update-user', payload);
    return response.data;
  },

  updateUserRole: async (employee_id: string, role: string) => {
    // This already matches the API spec
    const response = await api.put('/admin/user/update-role', {
      employee_id,
      role,
    });
    return response.data;
  },

  softDeleteUser: async (employee_id: string) => {
    // This already matches the API spec
    const response = await api.put('/admin/user/soft-delete-user', {
      employee_id,
    });
    return response.data;
  },

  restoreUser: async (employee_id: string) => {
    // This already matches the API spec
    const response = await api.put('/admin/user/restore-user', {
      employee_id,
    });
    return response.data;
  },
  
  getUserProfile: async () => {
    // This already matches the API spec
    const response = await api.get('/user/get-profile');
    return response.data;
  },
  
  updateUserProfile: async (formData: FormData) => {
    // This already matches the API spec
    const response = await api.put('/user/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
