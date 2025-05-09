
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, User, Lock } from 'lucide-react';

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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      {/* Logo */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <h1 className="text-5xl md:text-6xl font-bold text-orange-500">PTNG</h1>
      </div>
      
      {/* Login card */}
      <Card className="w-[350px] sm:w-[400px] shadow-sm border-gray-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-orange-500">Access Terminal</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  className="pl-10 rounded-md border-gray-200" 
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
                  className="pl-10 rounded-md border-gray-200" 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-md" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span>Authenticating...</span>
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
          <div className="text-sm text-center text-gray-600">
            <Link to="/forgot-password" className="text-gray-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="text-sm text-center text-gray-600">
            <Link to="/admin-setup" className="text-gray-500 hover:underline">
              First-time setup? Create admin user
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
