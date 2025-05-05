
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { userSchema } from '@/utils/schemas/userSchema';
import { authService } from '@/services/authService';
import type { UserFormValues } from '@/types/user';

export function AdminInitializer() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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
    try {
      const result = await authService.initializeAdminUser(data);
      if (result.success) {
        toast.success("Admin Created", {
          description: "You can now log in with these credentials",
        });
        setIsComplete(true);
      } else {
        toast.error("Failed to Create Admin", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
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
              onClick={() => window.location.href = '/login'}
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
      <CardFooter className="text-sm text-cyber-gray text-center">
        This setup should only be used once to create the first admin account.
      </CardFooter>
    </Card>
  );
}
