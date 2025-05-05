
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { userSchema } from '@/utils/schemas/userSchema';
import { authService } from '@/services/authService';
import type { UserFormValues } from '@/types/user';
import { AlertCircle } from 'lucide-react';

export function AdminInitializer() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'Admin',
      notes: '',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await authService.initializeAdminUser(data);
      
      if (result.success) {
        toast.success("Admin Created", {
          description: "You can now log in with these credentials",
        });
        setIsComplete(true);
      } else {
        // Handle different error scenarios
        if (result.message.includes("already exists")) {
          toast.error("Admin Already Exists", {
            description: "Please use the login page instead",
          });
          setTimeout(() => navigate('/login'), 3000);
        } else {
          toast.error("Failed to Create Admin", {
            description: result.message,
          });
          setErrorMessage(result.message || 'An error occurred during admin creation');
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
      setErrorMessage('Network or server error. Please check if your backend API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="glass-panel border-cyber-teal/30 w-[450px] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-cyber-teal">Setup Complete</CardTitle>
          <CardDescription className="text-cyber-gray">
            Your admin account has been created successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-cyber-gray">
              You can now log in using the credentials you provided.
            </p>
            <Button 
              className="cyber-button" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-cyber-teal/30 w-[450px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-cyber-teal">Create Admin User</CardTitle>
        <CardDescription className="text-cyber-gray">
          Set up the first admin account for your system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-700/50 rounded-md text-sm text-red-400 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Backend Error</p>
              <p>{errorMessage}</p>
              <p className="mt-2 text-xs">Please check if:</p>
              <ul className="list-disc list-inside text-xs mt-1">
                <li>Your backend API is running</li>
                <li>The API endpoint `/auth/initialize-admin` is implemented</li>
                <li>Your environment variables are set correctly</li>
              </ul>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyber-teal">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter admin's full name" 
                      className="border-cyber-teal/30 focus:border-cyber-blue"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyber-teal">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter admin's email address" 
                      className="border-cyber-teal/30 focus:border-cyber-blue"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyber-teal">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter admin's username" 
                      className="border-cyber-teal/30 focus:border-cyber-blue"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyber-teal">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Enter a secure password"
                      className="border-cyber-teal/30 focus:border-cyber-blue"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role is hidden and set to Admin */}
            <input type="hidden" {...form.register("role")} value="Admin" />
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="cyber-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Admin..." : "Create Admin User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-cyber-gray text-center flex flex-col space-y-2">
        <p>This setup should only be used once to create the first admin account.</p>
        
        <div className="text-xs p-3 bg-cyber-dark-blue/50 border border-cyber-teal/30 rounded-md">
          <p className="font-medium text-cyber-teal mb-1">Backend Implementation Required</p>
          <p>For this admin creation to work, make sure your backend has:</p>
          <ul className="list-disc list-inside mt-1">
            <li>An endpoint at <code>/auth/initialize-admin</code> that accepts POST requests</li>
            <li>Logic to verify no admin exists before creating a new one</li>
            <li>Proper validation and error handling</li>
            <li>User credential storage in your database</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
}
