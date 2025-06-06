import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';

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

  // Get all tasks
  getTasks(): Task[] {
    return [...this.tasks];
  }

  // Get task by ID
  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  // Add a new task
  addTask(task: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // Update an existing task
  updateTask(id: string, updatedTask: Partial<Task>): Task | undefined {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
      return this.tasks[taskIndex];
    }
    return undefined;
  }

  // Delete a task
  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      return true;
    }
    return false;
  }
}
