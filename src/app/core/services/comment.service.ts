import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$ = this.commentsSubject.asObservable();
  private pollingInterval = 30000; // 30 seconds
  private pollingSubscriptions: { [key: string]: any } = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

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
      userName: currentUser?.userName || 'anonymous', // Use email from AuthService
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
            tap((comments) => this.commentsSubject.next(comments))
          );
      }),
      catchError((error) => {
        console.error('Error adding comment:', error);
        return of([]);
      })
    );
  }

  editComment(taskId: string, commentId: string, newText: string) {
    return this.getComments(taskId).pipe(
      switchMap((comments) => {
        const updatedComments = comments.map((comment: any) =>
          comment.id === commentId ? { ...comment, text: newText } : comment
        );
        return this.http.patch(`http://localhost:3000/tasks/${taskId}`, {
          comments: updatedComments,
        });
      }),
      switchMap(() => this.getComments(taskId)),
      catchError((error) => {
        console.error('Error editing comment:', error);
        return of([]);
      })
    );
  }

  deleteComment(taskId: string, commentId: string) {
    return this.getComments(taskId).pipe(
      switchMap((comments) => {
        const updatedComments = comments.filter(
          (comment: any) => comment.id !== commentId
        );
        return this.http.patch(`http://localhost:3000/tasks/${taskId}`, {
          comments: updatedComments,
        });
      }),
      switchMap(() => this.getComments(taskId)),
      catchError((error) => {
        console.error('Error deleting comment:', error);
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

  private getCurrentUser(): { email: string } {
    return (
      JSON.parse(localStorage.getItem('currentUser') || '{}') || {
        email: 'anonymous',
      }
    );
  }
}
