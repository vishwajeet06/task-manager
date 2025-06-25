import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TaskService } from './task.service'; // Import TaskService for logActivity
import { NotificationService } from './notification.service'; // Import NotificationService

@Injectable({ providedIn: 'root' })
export class CommentService {
  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$ = this.commentsSubject.asObservable();
  private pollingInterval = 10000; // 30 seconds
  private pollingSubscriptions: { [key: string]: any } = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private taskService: TaskService, // Inject TaskService
    private notificationService: NotificationService // Inject NotificationService
  ) {}

  getComments(taskId: string) {
    return this.http.get<any>(`http://localhost:3000/tasks/${taskId}`).pipe(
      map((task) => task.comments || []),
      tap((comments) => this.commentsSubject.next(comments)),
      catchError(() => [])
    );
  }

  addComment(taskId: string, text: string) {
    const currentUser = this.authService.getCurrentUser();
    const comment = {
      id: Date.now().toString(),
      text,
      userName: currentUser?.userName || 'anonymous',
      timestamp: new Date().toISOString(),
    };
    return this.http.get<any>(`http://localhost:3000/tasks/${taskId}`).pipe(
      switchMap((task) => {
        const updatedComments = [...(task.comments || []), comment];
        return this.http
          .patch(`http://localhost:3000/tasks/${taskId}`, {
            comments: updatedComments,
          })
          .pipe(
            switchMap(() => this.getComments(taskId)),
            tap((comments) => {
              this.commentsSubject.next(comments);
              this.logCommentActivity(
                taskId,
                'Comment Added',
                `Comment added by ${comment.userName}: ${comment.text.substring(
                  0,
                  20
                )}...`
              );
              this.notificationService.success('Comment added successfully');
            })
          );
      }),
      catchError((error) => {
        console.error('Error adding comment:', error);
        this.notificationService.error('Failed to add comment');
        return of([]);
      })
    );
  }

  editComment(taskId: string, commentId: string, newText: string) {
    return this.getComments(taskId).pipe(
      switchMap((comments) => {
        const commentToEdit = comments.find((c: any) => c.id === commentId);
        const updatedComments = comments.map((comment: any) =>
          comment.id === commentId ? { ...comment, text: newText } : comment
        );
        return this.http
          .patch(`http://localhost:3000/tasks/${taskId}`, {
            comments: updatedComments,
          })
          .pipe(
            switchMap(() => this.getComments(taskId)),
            tap((comments) => {
              this.commentsSubject.next(comments);
              this.logCommentActivity(
                taskId,
                'Comment Edited',
                `Comment edited by ${
                  commentToEdit.userName
                }: ${newText.substring(0, 20)}...`
              );
              this.notificationService.success('Comment edited successfully');
            })
          );
      }),
      catchError((error) => {
        console.error('Error editing comment:', error);
        this.notificationService.error('Failed to edit comment');
        return of([]);
      })
    );
  }

  deleteComment(taskId: string, commentId: string) {
    return this.getComments(taskId).pipe(
      switchMap((comments) => {
        const commentToDelete = comments.find((c: any) => c.id === commentId);
        const updatedComments = comments.filter(
          (comment: any) => comment.id !== commentId
        );
        return this.http
          .patch(`http://localhost:3000/tasks/${taskId}`, {
            comments: updatedComments,
          })
          .pipe(
            switchMap(() => this.getComments(taskId)),
            tap((comments) => {
              this.commentsSubject.next(comments);
              this.logCommentActivity(
                taskId,
                'Comment Deleted',
                `Comment deleted by ${
                  commentToDelete.userName
                } in : ${commentToDelete.text.substring(0, 20)}...`
              );
              this.notificationService.success('Comment deleted successfully');
            })
          );
      }),
      catchError((error) => {
        console.error('Error deleting comment:', error);
        this.notificationService.error('Failed to delete comment');
        return of([]);
      })
    );
  }

  startPolling(taskId: string) {
    if (!this.pollingSubscriptions[taskId]) {
      this.pollingSubscriptions[taskId] = timer(0, this.pollingInterval)
        .pipe(switchMap(() => this.getComments(taskId)))
        .subscribe((comments) => this.commentsSubject.next(comments));
    }
  }

  stopPolling(taskId: string) {
    if (this.pollingSubscriptions[taskId]) {
      this.pollingSubscriptions[taskId].unsubscribe();
      delete this.pollingSubscriptions[taskId];
    }
  }

  private logCommentActivity(taskId: string, action: string, details: string) {
    const activity = {
      taskId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.taskService.logActivity(taskId, action, details).subscribe();
  }

  private getCurrentUser(): { email: string } {
    return (
      JSON.parse(localStorage.getItem('currentUser') || '{}') || {
        email: 'anonymous',
      }
    );
  }
}
