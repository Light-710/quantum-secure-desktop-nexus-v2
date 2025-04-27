import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus } from 'lucide-react';
import { UserForm } from '@/components/admin/users/UserForm';
import { UserList } from '@/components/admin/users/UserList';
import { UserPermissions } from '@/components/admin/users/UserPermissions';
import type { User, UserFormValues } from '@/types/user';

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
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
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
    
    toast({
      title: "User Updated",
      description: `${data.name}'s details have been updated.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
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
        if (user.role === 'Admin') {
          toast({
            title: "Cannot Change Admin Status",
            description: "The admin user status cannot be changed.",
            variant: "destructive",
          });
          return user;
        }
        
        const newStatus: 'Active' | 'Suspended' | 'Deactivated' = 
          user.status === 'Active' ? 'Suspended' : 'Active';
        
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
          <UserList 
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onViewPermissions={handleViewPermissions}
            onToggleStatus={handleStatusToggle}
          />
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          <UserForm 
            onSubmit={handleAddUser}
            onCancel={() => setIsAddUserOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          <UserForm 
            onSubmit={handleUpdateUser}
            onCancel={() => setIsEditUserOpen(false)}
            initialData={selectedUser ?? undefined}
            submitLabel="Update User"
          />
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-md">
          {selectedUser && (
            <UserPermissions 
              user={selectedUser}
              onClose={() => setIsPermissionsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersPage;
