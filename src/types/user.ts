
export type UserRole = 'Employee' | 'Manager' | 'Admin' | 'Tester';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deactivated';

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
  employee_id: string;
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

// Add a type for the API user response
export interface ApiUser {
  email: string;
  employee_id: string;
  name: string;
  role: string;
  status: string;
}

// Add a type for the API user response wrapper (if needed)
export interface ApiUserResponse {
  users?: ApiUser[];
}
