
import api from './api';

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
  // This matches the API spec POST /auth/login
  login: async (employee_id: string, password: string) => {
    const response = await api.post('/auth/login', { 
      employee_id, 
      password 
    });
    return response.data; // Returns { access_token, role }
  },
  
  // This matches the API spec POST /auth/logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // This matches the API spec POST /auth/request-password-reset
  requestPasswordReset: async (employee_id: string): Promise<PasswordResetResponse> => {
    const response = await api.post('/auth/request-password-reset', { employee_id });
    return response.data;
  },
  
  // This matches the API spec POST /auth/reset-password/{token}
  resetPassword: async (token: string, new_password: string): Promise<PasswordResetResponse> => {
    const response = await api.post(`/auth/reset-password/${token}`, { new_password });
    return response.data;
  },

  // Function to check if admin exists - not in API spec but needed for frontend
  checkAdminExists: async (): Promise<boolean> => {
    try {
      const response = await api.get('/auth/check-admin-exists');
      return response.data.adminExists;
    } catch (error) {
      // If endpoint doesn't exist or any error occurs, assume no admin
      return false;
    }
  },

  // Function to initialize the first admin user
  // This endpoint isn't in the API spec but would need to be added
  initializeAdminUser: async (adminData: {
    name: string;
    email: string;
    employee_id: string;
    password: string;
    role: string;
  }): Promise<AdminInitResponse> => {
    try {
      const response = await api.post('/auth/initialize-admin', adminData);
      
      return { 
        success: true, 
        message: response.data.message || 'Admin user created successfully',
        status: response.data.status
      };
    } catch (error: any) {
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
