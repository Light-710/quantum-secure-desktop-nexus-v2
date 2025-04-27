
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, Pencil, Trash2, Key } from "lucide-react";
import type { User } from "@/types/user";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onViewPermissions: (user: User) => void;
  onToggleStatus: (userId: string) => void;
}

export function UserList({ 
  users, 
  onEditUser, 
  onDeleteUser, 
  onViewPermissions, 
  onToggleStatus 
}: UserListProps) {
  return (
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
                    onClick={() => onViewPermissions(user)}
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                    onClick={() => onEditUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                    onClick={() => onDeleteUser(user.id)}
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
                    onClick={() => onToggleStatus(user.id)}
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
  );
}
