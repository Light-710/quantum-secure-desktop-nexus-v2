
import { useState, useEffect } from 'react';
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
import { userService } from '@/services/userService';

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        title: "Error Loading Users",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (data: UserFormValues) => {
    try {
      await userService.createUser(data);
      await loadUsers();
      setIsAddUserOpen(false);
      
      toast({
        title: "User Added",
        description: `${data.name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Adding User",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async (data: UserFormValues) => {
    if (!selectedUser) return;

    try {
      await userService.updateUser(selectedUser.id, data);
      await loadUsers();
      setIsEditUserOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "User Updated",
        description: `${data.name}'s details have been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error Updating User",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete?.role === 'Admin') {
      toast({
        title: "Cannot Delete Admin",
        description: "The admin user cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await userService.softDeleteUser(userId);
      await loadUsers();
      
      toast({
        title: "User Deleted",
        description: "The user has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error Deleting User",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsOpen(true);
  };

  const handleStatusToggle = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'Admin') {
      toast({
        title: "Cannot Change Admin Status",
        description: "The admin user status cannot be changed.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (user.status === 'Active') {
        await userService.softDeleteUser(userId);
      } else {
        await userService.restoreUser(userId);
      }
      await loadUsers();

      toast({
        title: "Status Updated",
        description: `${user.name}'s status has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error Updating Status",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-teal"></div>
        </div>
      </DashboardLayout>
    );
  }

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
