
import api from './api';
import type { User, UserFormValues } from '@/types/user';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/user/get-users');
    return response.data.users;
  },

  createUser: async (userData: UserFormValues) => {
    const response = await api.post('/admin/user/create-user', userData);
    return response.data;
  },

  updateUserRole: async (employee_id: string, role: string) => {
    const response = await api.put('/admin/user/update-role', {
      employee_id,
      role,
    });
    return response.data;
  },

  softDeleteUser: async (employee_id: string) => {
    const response = await api.put('/admin/user/soft-delete-user', {
      employee_id,
    });
    return response.data;
  },

  restoreUser: async (employee_id: string) => {
    const response = await api.put('/admin/user/restore-user', {
      employee_id,
    });
    return response.data;
  },
  
  getUserProfile: async () => {
    const response = await api.get('/user/get-profile');
    return response.data;
  },
  
  updateUserProfile: async (formData: FormData) => {
    const response = await api.put('/user/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
