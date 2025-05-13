
import api from './api';
import type { User, UserFormValues, UserProfile } from '@/types/user';

export const userService = {
  // This matches the API spec GET /admin/user/get-users
  getAllUsers: async () => {
    const response = await api.get('/admin/user/get-users');
    return response.data.users;
  },

  // This matches the API spec POST /admin/user/create-user
  createUser: async (userData: UserFormValues) => {
    const payload = {
      employee_id: userData.employee_id, // Using employee_id directly
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    const response = await api.post('/admin/user/create-user', payload);
    return response.data;
  },

  // This matches the API spec PUT /admin/user/update-user (although not in the Swagger doc)
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
      console.log('Attempting to soft-delete user with ID:', employee_id);
      
      // Send employee_id in the request body as expected by the backend
      const response = await api.put('/admin/user/soft-delete-user', {
        employee_id: employee_id,
      });
      
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
      // Ensure we're sending employee_id in the request body
      const response = await api.put('/admin/user/restore-user', {
        employee_id: employee_id,
      });
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
