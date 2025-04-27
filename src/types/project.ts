
export interface Project {
  id: string;
  name: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  dueDate: string;
}
