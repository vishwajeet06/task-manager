export interface Task {
  id: string;
  title: string;
  description: string;
  uniqueId?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  category: string;
  tags: string[];
  assignedTo: string;
  attachments: { name: string; size: number }[];
  comments?: [];
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

export type StatusCounts = Record<TaskStatus, number>;
export type PriorityCounts = Record<TaskPriority, number>;
