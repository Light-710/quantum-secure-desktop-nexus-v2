
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Define types for our auth context
type User = {
  employee_id: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager' | 'Admin';
  profile_picture?: string;
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

// Sample user data for demonstration
const sampleUsers = [
  {
    employee_id: 'EMP001',
    password: 'password123',
    name: 'John Employee',
    email: 'john@ptng.com',
    role: 'Employee',
  },
  {
    employee_id: 'MGR001',
    password: 'password123',
    name: 'Jane Manager',
    email: 'jane@ptng.com',
    role: 'Manager',
  },
  {
    employee_id: 'ADM001',
    password: 'password123',
    name: 'Alex Admin',
    email: 'alex@ptng.com',
    role: 'Admin',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('ptng_user');
    const storedToken = localStorage.getItem('ptng_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    setIsLoading(false);
  }, []);

  // Login function - in a real app, this would call your API
  const login = async (employee_id: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call using sample users
      const foundUser = sampleUsers.find(u => u.employee_id === employee_id && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Generate a mock token
      const mockToken = `mock-token-${Date.now()}`;
      
      // Remove the password before saving the user
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to state and local storage
      setUser(userWithoutPassword as User);
      setToken(mockToken);
      
      localStorage.setItem('ptng_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('ptng_token', mockToken);
      
      // Show success toast
      toast({
        title: "Login Successful",
        description: `Welcome, ${userWithoutPassword.name}.`,
        variant: "default",
      });
      
      // Redirect based on user role
      navigate(`/dashboard/${userWithoutPassword.role.toLowerCase()}`);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ptng_user');
    localStorage.removeItem('ptng_token');
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
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
