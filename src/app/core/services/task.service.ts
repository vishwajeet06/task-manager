// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { Activity } from '../models/activity';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private taskApiUrl = 'http://localhost:3000/tasks';
  private activityApiUrl = 'http://localhost:3000/activities';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskApiUrl);
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.taskApiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.taskApiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.taskApiUrl}/${id}`);
  }

  logActivity(
    taskId: string,
    action: string,
    details: string
  ): Observable<Activity> {
    const activity: Omit<Activity, 'id'> = {
      taskId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    return this.http.post<Activity>(this.activityApiUrl, activity);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `${this.activityApiUrl}?_sort=timestamp&_order=desc`
    );
  }
}
