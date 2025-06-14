// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { Task } from '../models/task';
import { Activity } from '../models/activity';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private taskApiUrl = 'http://localhost:3000/tasks';
  private activityApiUrl = 'http://localhost:3000/activities';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  private checkAdminAccess(): Observable<boolean> {
    return this.authService.isAdmin();
  }

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.taskApiUrl)
      .pipe(catchError(() => of([])));
  }

  // addTask(task: Omit<Task, 'id'>): Observable<Task> {
  //   return this.http.post<Task>(this.taskApiUrl, task);
  // }

  addTask(task: any): Observable<any> {
    return this.checkAdminAccess().pipe(
      switchMap((isAdmin) => {
        if (!isAdmin) {
          this.notificationService.error('Only admins can add tasks');
          throw new Error('Only admins can add tasks');
        }
        return this.http
          .post<any>(this.taskApiUrl, task)
          .pipe(
            tap(() =>
              this.notificationService.success('Task added succesfully')
            )
          );
      }),
      catchError((error) => {
        this.notificationService.error('Failed to add task');
        console.error(error.message);
        return of(null);
      })
    );
  }

  // updateTask(id: string, task: Partial<Task>): Observable<Task> {
  //   return this.http.patch<Task>(`${this.taskApiUrl}/${id}`, task);
  // }

  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.checkAdminAccess().pipe(
      switchMap((isAdmin) => {
        if (!isAdmin) {
          this.notificationService.error('Only admins can update tasks');
          throw new Error('Only admins can update tasks');
        }
        return this.http
          .put<any>(`${this.taskApiUrl}/${id}`, task)
          .pipe(
            tap(() =>
              this.notificationService.success('Task updated succesfully')
            )
          );
      }),
      catchError((error) => {
        this.notificationService.error('Failed to update task');
        console.error(error.message);
        return of(null);
      })
    );
  }

  // deleteTask(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.taskApiUrl}/${id}`);
  // }

  deleteTask(id: string): Observable<boolean> {
    return this.checkAdminAccess().pipe(
      switchMap((isAdmin) => {
        if (!isAdmin) {
          this.notificationService.error('Only admins can delete tasks');
          throw new Error('Only admins can delete tasks');
        }
        return this.http.delete(`${this.taskApiUrl}/${id}`).pipe(
          map(() => true),
          tap(() =>
            this.notificationService.success('Task deleted successfully')
          ),
          catchError(() => {
            this.notificationService.error('Failed to delete task');
            return of(false);
          })
        );
      }),
      catchError((error) => {
        this.notificationService.error('Failed to delete task');
        console.error(error.message);
        return of(false);
      })
    );
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

// tap Operator: Used to show success messages after successful operations without altering the observable stream.
