import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { Task } from '../models/task';
import { Activity } from '../models/activity';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { v4 as uuidv4 } from 'uuid'; // Install via `npm install uuid`

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
    return this.http.get<Task[]>(this.taskApiUrl).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          ...task,
          uniqueId: task.uniqueId || uuidv4(), // Assign uniqueId if not present
        }))
      ),
      tap((updatedTasks) => {
        updatedTasks.forEach((task) => {
          if (!task.uniqueId || task.uniqueId !== task.uniqueId) {
            this.updateTask(task.id, { uniqueId: task.uniqueId }).subscribe();
          }
        });
      }),
      catchError(() => of([]))
    );
  }

  getTaskBySlug(slug: string): Observable<Task | null> {
    return this.getTasks().pipe(
      map((tasks) => {
        const task = tasks.find((t) => this.generateSlug(t.title) === slug);
        return task || null;
      }),
      catchError(() => of(null))
    );
  }

  addTask(task: any): Observable<any> {
    return this.checkAdminAccess().pipe(
      switchMap((isAdmin) => {
        if (!isAdmin) {
          this.notificationService.error('Only admins can add tasks');
          throw new Error('Only admins can add tasks');
        }
        const taskWithUniqueId = { ...task, uniqueId: uuidv4() }; // Assign uniqueId
        return this.http
          .post<any>(this.taskApiUrl, taskWithUniqueId)
          .pipe(
            tap(() =>
              this.notificationService.success('Task added successfully')
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

  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.checkAdminAccess().pipe(
      switchMap((isAdmin) => {
        if (!isAdmin) {
          this.notificationService.error('Only admins can update tasks');
          throw new Error('Only admins can update tasks');
        }
        const updateData = { ...task, uniqueId: task.uniqueId || uuidv4() };
        return this.http
          .patch<any>(`${this.taskApiUrl}/${id}`, updateData) // Use patch for partial update
          .pipe(
            tap(() =>
              this.notificationService.success('Task updated successfully')
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

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/ /g, '-');
  }
}
