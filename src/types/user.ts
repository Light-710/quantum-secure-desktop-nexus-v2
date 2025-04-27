
export type UserRole = 'Employee' | 'Manager' | 'Admin';
export type UserStatus = 'Active' | 'Suspended' | 'Deactivated';

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  permissions: string[];
};

export type UserFormValues = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: Exclude<UserRole, 'Admin'>;
  notes?: string;
};
