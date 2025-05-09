import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, ChevronRight, Info } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/components/ui/sonner';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingTestAdmin, setIsCreatingTestAdmin] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(employeeId, password);
  };

  const handleCreateTestAdmin = async () => {
    setIsCreatingTestAdmin(true);
    try {
      const result = await authService.createTestAdminUser();
      if (result.success) {
        toast.success("Test Admin Created", {
          description: "Username: 1, Password: 1",
        });
        // Auto-fill the credentials
        setEmployeeId('1');
        setPassword('1');
      } else {
        toast.error("Failed to Create Test Admin", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create test admin user.",
      });
    } finally {
      setIsCreatingTestAdmin(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div className="cyber-grid-bg" />
      <div className="scan-line animate-scan-line" />
      
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl md:text-5xl neon-blue font-black tracking-wider">PTNG</h1>
      </div>
      
      {/* Login card */}
      <Card className="w-[350px] sm:w-[400px] glass-panel border-cyber-teal/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-cyber-teal">Access Terminal</CardTitle>
          <CardDescription className="text-center text-cyber-gray">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-cyber-blue/70" />
                <Input 
                  className="pl-10 bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal focus:border-cyber-blue focus:ring-cyber-blue" 
                  type="text" 
                  placeholder="Employee ID" 
                  value={employeeId} 
                  onChange={e => setEmployeeId(e.target.value)} 
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-cyber-blue/70" />
                <Input 
                  className="pl-10 bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal focus:border-cyber-blue focus:ring-cyber-blue" 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button className="w-full cyber-button group" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse">Authenticating...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Login <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>
          
          {/* Test Admin Button */}
          <div className="mt-4 pt-2 border-t border-cyber-teal/20">
            <Button 
              onClick={handleCreateTestAdmin}
              disabled={isCreatingTestAdmin}
              variant="outline" 
              className="w-full text-cyber-blue hover:text-cyber-teal hover:bg-cyber-dark-blue/30 border-cyber-teal/30 flex items-center justify-center gap-2"
            >
              <Info className="h-4 w-4" />
              {isCreatingTestAdmin ? "Creating Test Admin..." : "Create Test Admin User"}
            </Button>
            <p className="text-xs text-cyber-gray mt-2">
              For testing purposes only. Creates an admin user with:<br />
              Username: <span className="text-cyber-teal">1</span>, Password: <span className="text-cyber-teal">1</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-cyber-gray">
            <Link to="/forgot-password" className="text-cyber-blue hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="text-sm text-center text-cyber-gray">
            <Link to="/admin-setup" className="text-cyber-blue hover:underline">
              First-time setup? Create admin user
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
