
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userSchema } from "@/utils/schemas/userSchema";
import type { User, UserFormValues } from "@/types/user";

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  initialData?: User;
  submitLabel?: string;
}

export function UserForm({ onSubmit, onCancel, initialData, submitLabel = "Add User" }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      username: initialData?.username ?? "",
      password: "",
      role: (initialData?.role === 'Admin' ? 'Manager' : initialData?.role) ?? "Employee",
      notes: "",
    },
  });

  return (
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
                  placeholder="Enter full name" 
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
                  placeholder="Enter email address" 
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
                  placeholder="Enter username" 
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
              <FormLabel className="text-cyber-teal">
                {initialData ? "Password (leave blank to keep unchanged)" : "Password"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder={initialData ? "Enter new password or leave blank" : "Enter secure password"}
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyber-teal">Role</FormLabel>
              <FormControl>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border border-cyber-teal/30 bg-cyber-dark-blue/20 text-cyber-gray focus:border-cyber-blue"
                  {...field}
                  disabled={initialData?.role === 'Admin'}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyber-teal">Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes about this user" 
                  className="border-cyber-teal/30 focus:border-cyber-blue"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="border-cyber-teal/30"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="cyber-button"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
