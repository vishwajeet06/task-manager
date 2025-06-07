import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskMockService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Design Homepage',
      description: 'Create wireframes and mockups for the homepage.',
      priority: 'High',
      dueDate: '2025-06-10',
      status: 'To Do',
      category: 'Work',
      tags: ['design', 'ui'],
      assignedTo: 'John Doe',
      attachments: [],
    },
    {
      id: '2',
      title: 'Write Documentation',
      description: 'Document the API endpoints and usage.',
      priority: 'Medium',
      dueDate: '2025-06-15',
      status: 'In Progress',
      category: 'Work',
      tags: ['docs', 'api'],
      assignedTo: 'Jane Doe',
      attachments: [{ name: 'api-spec.pdf', size: 102400 }],
    },
    {
      id: '3',
      title: 'Plan Vacation',
      description: 'Book flights and hotels for summer vacation.',
      priority: 'High',
      dueDate: '2025-06-20',
      status: 'Completed',
      category: 'Personal',
      tags: ['travel', 'vacation'],
      assignedTo: 'John Doe',
      attachments: [],
    },
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = { ...task, id: uuidv4() };
    this.tasks.push(newTask);
    return of(newTask);
  }

  updateTask(id: string, task: Omit<Task, 'id'>): Observable<Task> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...task, id };
      return of(this.tasks[index]);
    }
    throw new Error('Task not found');
  }

  deleteTask(id: string): Observable<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return of(void 0);
  }
}
