
export type UserRole = 'Employee' | 'Manager' | 'Admin' | 'Tester';
export type UserStatus = 'Active' | 'Suspended' | 'Deactivated';

export type User = {
  id: string;
  name: string;
  email: string;
  employee_id: string; // This is the correct field expected by the API
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  permissions: string[];
};

export type UserFormValues = {
  name: string;
  email: string;
  employee_id: string; // Using employee_id instead of username
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
