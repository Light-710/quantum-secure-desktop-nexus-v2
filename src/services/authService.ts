
import api from './api';
import type { UserFormValues } from '@/types/user';

export interface PasswordResetResponse {
  message: string;
  reset_link?: string;
}

export interface AdminInitResponse {
  success: boolean;
  message: string;
  status?: string;
  error?: string;
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

  // Function to check if admin exists
  checkAdminExists: async (): Promise<boolean> => {
    try {
      const response = await api.get('/auth/check-admin-exists');
      return response.data.adminExists;
    } catch (error) {
      // If endpoint doesn't exist or any error occurs, assume no admin
      return false;
    }
  },

  // Enhanced function to initialize the first admin user with better error handling
  initializeAdminUser: async (adminData: UserFormValues): Promise<AdminInitResponse> => {
    try {
      // This endpoint should be protected in your backend to only work when no admin exists
      const response = await api.post('/auth/initialize-admin', adminData);
      
      return { 
        success: true, 
        message: response.data.message || 'Admin user created successfully',
        status: response.data.status
      };
    } catch (error: any) {
      // Extract more detailed error information
      const errorMessage = error.response?.data?.message || 'Failed to create admin user';
      const errorDetails = error.response?.data?.error || '';
      
      console.error('Admin initialization error:', error.response?.data || error);
      
      return { 
        success: false, 
        message: errorMessage,
        error: errorDetails
      };
    }
  }
};
