
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, ChevronRight } from 'lucide-react';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(employeeId, password);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div className="cyber-grid-bg" />
      <div className="scan-line animate-scan-line" />
      
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl md:text-5xl neon-blue font-black tracking-wider">PTNG</h1>
        <p className="text-sm md:text-base text-cyber-teal text-center">QUANTUM-SECURE DESKTOP NEXUS</p>
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
                  onChange={(e) => setEmployeeId(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                className="w-full cyber-button group" 
                type="submit" 
                disabled={isLoading}
              >
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-cyber-gray">
            <Link to="/forgot-password" className="text-cyber-blue hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="text-sm text-center text-cyber-gray">
            <Link to="/contact" className="text-cyber-blue hover:underline">
              Contact Support
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      {/* Demo credentials */}
      <div className="mt-8 text-center">
        <p className="text-cyber-gray text-sm">Demo Credentials:</p>
        <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
          <div className="text-cyber-blue">
            <p>Employee:</p>
            <p>EMP001 / password123</p>
          </div>
          <div className="text-cyber-green">
            <p>Manager:</p>
            <p>MGR001 / password123</p>
          </div>
          <div className="text-cyber-teal">
            <p>Admin:</p>
            <p>ADM001 / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
