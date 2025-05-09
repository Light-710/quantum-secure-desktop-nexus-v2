
export type UserRole = 'Employee' | 'Manager' | 'Admin';
export type UserStatus = 'Active' | 'Suspended' | 'Deactivated';

export type User = {
  id: string;
  name: string;
  email: string;
  username: string; // This corresponds to employee_id in the API
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  permissions: string[];
};

export type UserFormValues = {
  name: string;
  email: string;
  username: string; // This corresponds to employee_id in the API
  password: string;
  role: UserRole;
  notes?: string;
};

export interface UserProfile {
  employee_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile_picture?: string;
}
