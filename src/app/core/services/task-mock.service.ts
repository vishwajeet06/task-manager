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
    // Return a deep copy of the tasks array
    return of(
      this.tasks.map((task) => ({
        ...task,
        attachments: [...task.attachments],
      }))
    );
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = { ...task, id: uuidv4() };
    // Create a new array with the new task instead of mutating the existing one
    this.tasks = [...this.tasks, newTask];
    return of(newTask);
  }

  updateTask(id: string, task: Omit<Task, 'id'>): Observable<Task> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      // Create a new array with the updated task
      const updatedTask = { ...this.tasks[index], ...task };
      this.tasks = [
        ...this.tasks.slice(0, index),
        updatedTask,
        ...this.tasks.slice(index + 1),
      ];
      return of(updatedTask);
    }
    throw new Error('Task not found');
  }

  deleteTask(id: string): Observable<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return of(void 0);
  }
}
