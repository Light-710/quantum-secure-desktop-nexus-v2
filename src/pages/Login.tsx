
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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Logo */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <h1 className="text-5xl md:text-6xl font-bold text-[#C47D5F]">PTNG</h1>
      </div>
      
      {/* Login card */}
      <Card className="w-[350px] sm:w-[400px] shadow-subtle border-[#D6D2C9] bg-[#FCFAF7]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-[#C47D5F]">Access Terminal</CardTitle>
          <CardDescription className="text-[#A8A39D]">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#A8A39D]" />
                <Input 
                  className="pl-10 rounded-md border-[#D6D2C9] bg-white focus-visible:ring-[#C47D5F]/20 focus-visible:border-[#C47D5F]" 
                  type="text" 
                  placeholder="Employee ID" 
                  value={employeeId} 
                  onChange={e => setEmployeeId(e.target.value)} 
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#A8A39D]" />
                <Input 
                  className="pl-10 rounded-md border-[#D6D2C9] bg-white focus-visible:ring-[#C47D5F]/20 focus-visible:border-[#C47D5F]" 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button className="w-full bg-[#C47D5F] hover:bg-[#C47D5F]/90 text-white rounded-md" type="submit" disabled={isLoading}>
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
          <div className="text-sm text-center text-[#A8A39D]">
            <Link to="/forgot-password" className="text-[#C47D5F] hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="text-sm text-center text-[#A8A39D]">
            <Link to="/admin-setup" className="text-[#C47D5F] hover:underline">
              First-time setup? Create admin user
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
