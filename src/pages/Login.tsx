
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
    console.log('Login form submitted', { employeeId, password });
    await login(employeeId, password);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600">PTNG</h1>
      </div>
      
      {/* Login card */}
      <Card className="w-[350px] sm:w-[400px] shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Access Terminal</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  className="pl-10" 
                  type="text" 
                  placeholder="Employee ID" 
                  value={employeeId} 
                  onChange={e => setEmployeeId(e.target.value)} 
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  className="pl-10" 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse">Authenticating...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Login <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500">
            <Link to="/admin-setup" className="text-blue-600 hover:underline">
              First-time setup? Create admin user
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
