
export interface Project {
  id: string | number;
  name: string;
  status: string;
  description: string;
  start_date?: string;
  end_date?: string;
  scope?: string;
  manager?: string; // Manager name
  managerId?: string | number; // Manager ID
}

export interface ApiProject {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string | null;
  scope: string;
  manager?: string;
}

export interface ProjectFormValues {
  name: string;
  description: string;
  status?: string;
  start_date: string;
  end_date: string;
  scope?: string;
  managerId?: string | number; // Use managerId consistently
}

export interface ProjectAssignment {
  project_id: number;
  employee_id: number;
}
