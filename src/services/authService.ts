
import api from './api';

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
  }
};
