export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string; // ISO date string, e.g., '2025-06-15'
  status: 'To Do' | 'In Progress' | 'Completed';
  category: string;
}
