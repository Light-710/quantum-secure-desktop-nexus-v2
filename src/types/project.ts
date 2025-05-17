
export interface Project {
  id: string | number;
  name: string;
  status: string;
  description: string;
  start_date?: string;
  end_date?: string;
  scope?: string;
  dueDate?: string; // For backward compatibility
  teamSize?: number; // For backward compatibility
  manager?: string; // For backward compatibility
  managerId?: string | number; // For backward compatibility
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
  managerId?: string | number;
}

export interface ProjectAssignment {
  project_id: number;
  employee_id: number;
}
