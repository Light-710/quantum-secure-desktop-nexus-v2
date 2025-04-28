
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

  updateUserRole: async (employeeId: string, role: string) => {
    const response = await api.put('/admin/user/update-role', {
      employee_id: employeeId,
      role,
    });
    return response.data;
  },

  softDeleteUser: async (employeeId: string) => {
    const response = await api.put('/admin/user/soft-delete-user', {
      employee_id: employeeId,
    });
    return response.data;
  },

  restoreUser: async (employeeId: string) => {
    const response = await api.put('/admin/user/restore-user', {
      employee_id: employeeId,
    });
    return response.data;
  },
};
