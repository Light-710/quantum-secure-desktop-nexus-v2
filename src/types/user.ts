
export type UserRole = 'Employee' | 'Manager' | 'Admin';
export type UserStatus = 'Active' | 'Suspended' | 'Deactivated';

export type User = {
  id: string;
  name: string;
  email: string;
  employee_id: string; // Changing from username to employee_id to match API
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  permissions: string[];
};

export type UserFormValues = {
  name: string;
  email: string;
  employee_id: string; // Changing from username to employee_id to match API
  password: string;
  role: UserRole;
};

export interface UserProfile {
  employee_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile_picture?: string;
}
