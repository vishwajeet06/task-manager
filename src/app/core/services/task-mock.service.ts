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
      id: uuidv4(),
      title: 'Design Homepage',
      description: 'Create wireframes and mockups for the homepage.',
      priority: 'High',
      dueDate: '2025-06-10',
      status: 'In Progress',
      category: 'Work',
    },
    {
      id: uuidv4(),
      title: 'Grocery Shopping',
      description: 'Buy groceries for the week.',
      priority: 'Medium',
      dueDate: '2025-06-08',
      status: 'To Do',
      category: 'Personal',
    },
    {
      id: uuidv4(),
      title: 'Finish Report',
      description: 'Complete the quarterly financial report.',
      priority: 'High',
      dueDate: '2025-06-12',
      status: 'Completed',
      category: 'Work',
    },
  ];

  // Get all tasks as Observable
  getTasks(): Observable<Task[]> {
    return of([...this.tasks]); // Wrap in Observable using of()
  }

  // Get task by ID as Observable
  getTaskById(id: string): Observable<Task | undefined> {
    return of(this.tasks.find((task) => task.id === id));
  }

  // Add a new task as Observable
  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };
    this.tasks.push(newTask);
    return of(newTask);
  }

  // Update task as Observable
  updateTask(
    id: string,
    updatedTask: Partial<Task>
  ): Observable<Task | undefined> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
      return of(this.tasks[taskIndex]);
    }
    return of(undefined);
  }

  // Delete task as Observable
  deleteTask(id: string): Observable<boolean> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      return of(true);
    }
    return of(false);
  }
}
