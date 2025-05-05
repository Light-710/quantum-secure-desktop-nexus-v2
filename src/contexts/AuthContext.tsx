
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import api from '@/services/api';

// Define types for our auth context
type User = {
  employee_id: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager' | 'Admin';
  profile_picture?: string;
  status?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (employee_id: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('ptng_user');
    const storedToken = localStorage.getItem('ptng_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      
      // Validate token by fetching user profile
      fetchUserProfile(storedToken).catch(() => {
        // If token is invalid, clear storage and state
        clearAuthState();
      });
    }
    
    setIsLoading(false);
  }, []);
  
  // Helper to fetch user profile with token
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await api.get('/user/get-profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(response.data);
      localStorage.setItem('ptng_user', JSON.stringify(response.data));
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

  // Login function
  const login = async (employee_id: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', { 
        employee_id, 
        password 
      });
      
      const { access_token, role } = response.data;
      
      // Save token
      setToken(access_token);
      localStorage.setItem('ptng_token', access_token);
      
      // Fetch user details with the token
      await fetchUserProfile(access_token);
      
      // Show success toast
      toast("Login Successful", {
        description: `Welcome back!`,
      });
      
      // Redirect based on user role
      navigate(`/dashboard/${role.toLowerCase()}`);
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Call the logout API endpoint
      await api.post('/auth/logout');
    } catch (error) {
      // Even if the API call fails, proceed with local logout
      console.error("Error during logout:", error);
    } finally {
      // Clear state and storage regardless of API response
      clearAuthState();
      setIsLoading(false);
      
      toast("Logged Out", {
        description: "You have been successfully logged out.",
      });
      
      navigate('/login');
    }
  };
  
  // Helper to clear auth state
  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ptng_user');
    localStorage.removeItem('ptng_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
