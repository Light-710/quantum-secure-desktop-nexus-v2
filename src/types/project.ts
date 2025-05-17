
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
  managerId?: string; // For backward compatibility
}

export interface ApiProject {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  scope: string;
}
