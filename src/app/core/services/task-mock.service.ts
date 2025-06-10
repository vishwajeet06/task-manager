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
      category: '',
      tags: ['design', 'ui'],
      assignedTo: 'Alice',
      attachments: [],
    },
    {
      id: '2',
      title: 'Implement Login API',
      description: 'Develop the login API with JWT authentication.',
      priority: 'Medium',
      dueDate: '2025-06-15',
      status: 'In Progress',
      category: '',
      tags: ['api', 'backend'],
      assignedTo: 'Charlie',
      attachments: [{ name: 'api-spec.pdf', size: 2048 }],
    },
    {
      id: '3',
      title: 'Test Payment Gateway',
      description: 'Run tests on the payment gateway integration.',
      priority: 'High',
      dueDate: '2025-06-20',
      status: 'Completed',
      category: '',
      tags: ['testing', 'payment'],
      assignedTo: 'Dave',
      attachments: [],
    },
    {
      id: '4',
      title: 'Review UI Designs',
      description: 'Review the UI designs for the dashboard.',
      priority: 'Critical',
      dueDate: '2025-06-05',
      status: 'In Review',
      category: 'Design',
      tags: ['ui', 'review'],
      assignedTo: 'Eve',
      attachments: [],
    },
    {
      id: '5',
      title: 'Fix Bugs in Checkout',
      description: 'Resolve bugs reported in the checkout process.',
      priority: 'Low',
      dueDate: '2025-06-12',
      status: 'In Progress',
      category: 'Development',
      tags: ['bug', 'checkout'],
      assignedTo: 'Frank',
      attachments: [],
    },
    {
      id: '6',
      title: 'Plan Sprint 3',
      description: 'Plan tasks and goals for Sprint 3.',
      priority: 'Medium',
      dueDate: '2025-06-09',
      status: 'To Do',
      category: 'Planning',
      tags: ['sprint', 'planning'],
      assignedTo: 'Grace',
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
