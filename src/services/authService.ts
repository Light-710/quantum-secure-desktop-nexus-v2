
import api from './api';
import type { UserFormValues } from '@/types/user';

export interface PasswordResetResponse {
  message: string;
  reset_link?: string;
}

export const authService = {
  requestPasswordReset: async (employee_id: string): Promise<PasswordResetResponse> => {
    const response = await api.post('/auth/request-password-reset', { employee_id });
    return response.data;
  },
  
  resetPassword: async (token: string, new_password: string): Promise<PasswordResetResponse> => {
    const response = await api.post(`/auth/reset-password/${token}`, { new_password });
    return response.data;
  },

  // New function to initialize the first admin user
  initializeAdminUser: async (adminData: UserFormValues): Promise<{success: boolean; message: string}> => {
    try {
      // This endpoint should be protected in your backend to only work when no admin exists
      const response = await api.post('/auth/initialize-admin', adminData);
      return { success: true, message: response.data.message || 'Admin user created successfully' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create admin user' 
      };
    }
  }
};
