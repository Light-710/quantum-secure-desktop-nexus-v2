import api from './api';
import type { User, UserFormValues, UserProfile, ApiUser } from '@/types/user';

export const userService = {
  // This matches the actual API response format (direct array of users)
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/user/get-users');
      console.log('API response for getAllUsers:', response.data);
      // Return the data directly as it's already an array of users
      return response.data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  // This matches the API spec POST /admin/user/create-user
  createUser: async (userData: UserFormValues) => {
    const payload = {
      employee_id: userData.employee_id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    const response = await api.post('/admin/user/create-user', payload);
    return response.data;
  },

  // This matches the API spec PUT /admin/user/update-user
  updateUser: async (employee_id: string, userData: UserFormValues) => {
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

  // This matches the API spec PUT /admin/user/update-role
  updateUserRole: async (employee_id: string, role: string) => {
    const response = await api.put('/admin/user/update-role', {
      employee_id,
      role,
    });
    return response.data;
  },

  // This matches the API spec PUT /admin/user/soft-delete-user
  softDeleteUser: async (employee_id: string) => {
    try {
      // Validate input to prevent sending undefined values
      if (!employee_id) {
        throw new Error('Employee ID is required for deletion');
      }
      
      console.log('Attempting to soft-delete user with employee_id:', employee_id);
      
      // Explicitly structure the payload as expected by the API
      const payload = { employee_id };
      console.log('Sending payload:', payload);
      
      const response = await api.put('/admin/user/soft-delete-user', payload);
      
      console.log('Soft delete response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in softDeleteUser:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to delete user. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'User not found. They may have been already deleted.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  // This matches the API spec PUT /admin/user/restore-user
  restoreUser: async (employee_id: string) => {
    try {
      // Validate input to prevent sending undefined values
      if (!employee_id) {
        throw new Error('Employee ID is required for restoration');
      }
      
      console.log('Attempting to restore user with employee_id:', employee_id);
      
      // Explicitly structure the payload as expected by the API
      const payload = { employee_id };
      console.log('Sending payload:', payload);
      
      const response = await api.put('/admin/user/restore-user', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error in restoreUser:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to restore user. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'User not found.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  },
  
  // Updated to include better debugging for the /user/get-profile endpoint
  getUserProfile: async () => {
    console.log('Getting user profile...');
    try {
      const token = localStorage.getItem('ptng_token');
      console.log('Auth token available:', !!token);
      
      const response = await api.get('/user/get-profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // This matches the API spec PUT /user/update-profile
  updateUserProfile: async (formData: FormData) => {
    try {
      const response = await api.put('/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};
