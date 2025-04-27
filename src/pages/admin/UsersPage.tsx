
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Pencil, Trash2, Shield, User, Key } from 'lucide-react';

// User type with extended details
type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'Employee' | 'Manager' | 'Admin';
  status: 'Active' | 'Suspended' | 'Deactivated';
  lastLogin: string;
  permissions: string[];
};

// Form schema for user creation/editing
const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  role: z.enum(["Employee", "Manager"]),
  notes: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

// Sample user data
const sampleUsers: User[] = [
  {
    id: 'U001',
    name: 'John Employee',
    email: 'john@ptng.com',
    username: 'john_emp',
    role: 'Employee',
    status: 'Active',
    lastLogin: '2025-04-27 09:12:33',
    permissions: ['Access Virtual Machines', 'Submit Reports']
  },
  {
    id: 'U002',
    name: 'Jane Manager',
    email: 'jane@ptng.com',
    username: 'jane_mgr',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-04-27 08:45:10',
    permissions: ['Access Virtual Machines', 'Submit Reports', 'Manage Projects', 'View Team']
  },
  {
    id: 'U003',
    name: 'Alex Admin',
    email: 'alex@ptng.com',
    username: 'alex_adm',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2025-04-27 07:30:24',
    permissions: ['All Permissions']
  },
  {
    id: 'U004',
    name: 'Sam Smith',
    email: 'sam@ptng.com',
    username: 'sam_smith',
    role: 'Employee',
    status: 'Suspended',
    lastLogin: '2025-04-24 15:22:57',
    permissions: ['Limited Access']
  },
];

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "Employee",
      notes: "",
    },
  });

  const handleAddUser = (data: UserFormValues) => {
    const newUser: User = {
      id: `U${(users.length + 1).toString().padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      username: data.username,
      role: data.role,
      status: 'Active',
      lastLogin: 'Never',
      permissions: data.role === 'Employee' 
        ? ['Access Virtual Machines', 'Submit Reports'] 
        : ['Access Virtual Machines', 'Submit Reports', 'Manage Projects', 'View Team']
    };

    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    form.reset();
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("username", user.username);
    form.setValue("password", ""); // Don't show existing password
    form.setValue("role", user.role === 'Admin' ? 'Manager' : user.role);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = (data: UserFormValues) => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: data.name,
          email: data.email,
          username: data.username,
          role: data.role,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    setSelectedUser(null);
    form.reset();
    
    toast({
      title: "User Updated",
      description: `${data.name}'s details have been updated.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    // Don't allow deleting the Admin user
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete?.role === 'Admin') {
      toast({
        title: "Cannot Delete Admin",
        description: "The admin user cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    toast({
      title: "User Deleted",
      description: "The user has been removed from the system.",
    });
  };

  const handleViewPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsOpen(true);
  };

  const handleStatusToggle = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        // Don't allow changing Admin status
        if (user.role === 'Admin') {
          toast({
            title: "Cannot Change Admin Status",
            description: "The admin user status cannot be changed.",
            variant: "destructive",
          });
          return user;
        }
        
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        return {
          ...user,
          status: newStatus,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    const updatedUser = updatedUsers.find(u => u.id === userId);
    
    toast({
      title: "Status Updated",
      description: `${updatedUser?.name}'s status changed to ${updatedUser?.status}.`,
    });
  };

  return (
    <DashboardLayout>
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-cyber-teal">User Management</CardTitle>
            <CardDescription className="text-cyber-gray">
              Manage system users, their roles and permissions
            </CardDescription>
          </div>
          <Button className="cyber-button" onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-cyber-teal/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-cyber-dark-blue/40">
                <TableRow>
                  <TableHead className="text-cyber-teal">User</TableHead>
                  <TableHead className="text-cyber-teal">Role</TableHead>
                  <TableHead className="text-cyber-teal">Status</TableHead>
                  <TableHead className="text-cyber-teal">Last Login</TableHead>
                  <TableHead className="text-cyber-teal">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-cyber-dark-blue/20">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-cyber-dark-blue flex items-center justify-center text-cyber-teal border border-cyber-teal/30">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-cyber-teal">{user.name}</p>
                          <div className="text-xs text-cyber-gray">{user.email}</div>
                          <div className="text-xs text-cyber-gray/70">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'Admin' 
                          ? 'bg-cyber-red/20 text-cyber-red' 
                          : user.role === 'Manager' 
                            ? 'bg-cyber-green/20 text-cyber-green' 
                            : 'bg-cyber-blue/20 text-cyber-blue'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-400/20 text-green-400' 
                          : user.status === 'Suspended' 
                            ? 'bg-yellow-400/20 text-yellow-400' 
                            : 'bg-cyber-red/20 text-cyber-red'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-cyber-gray">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                          onClick={() => handleViewPermissions(user)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`h-8 w-8 p-0 border-cyber-teal/30 ${
                            user.status === 'Active'
                              ? 'hover:bg-yellow-400/20 hover:text-yellow-400'
                              : 'hover:bg-green-400/20 hover:text-green-400'
                          }`}
                          onClick={() => handleStatusToggle(user.id)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyber-teal">Add New User</DialogTitle>
            <DialogDescription className="text-cyber-gray">
              Enter the details for the new system user
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
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
                    <FormLabel className="text-cyber-teal">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter secure password" 
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
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="cyber-button"
                >
                  Add User
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyber-teal">Edit User</DialogTitle>
            <DialogDescription className="text-cyber-gray">
              Update the user's information
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-4">
              {/* Same form fields as Add User */}
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
                    <FormLabel className="text-cyber-teal">Password (leave blank to keep unchanged)</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter new password or leave blank" 
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
                        disabled={selectedUser?.role === 'Admin'}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                      </select>
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
                  onClick={() => setIsEditUserOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="cyber-button"
                >
                  Update User
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyber-teal">User Permissions</DialogTitle>
            <DialogDescription className="text-cyber-gray">
              {selectedUser?.name}'s system permissions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedUser?.permissions.map((permission, index) => (
              <div 
                key={index} 
                className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20"
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-cyber-blue" />
                  <span className="text-cyber-teal">{permission}</span>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
              <Button 
                className="cyber-button"
                onClick={() => setIsPermissionsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersPage;
