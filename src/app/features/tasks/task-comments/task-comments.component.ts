import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditCommentDialogComponent } from '../edit-comment-dialog/edit-comment-dialog.component';

@Component({
  selector: 'app-task-comments',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIcon,
  ],
  templateUrl: './task-comments.component.html',
  styleUrl: './task-comments.component.scss',
})
export class TaskCommentsComponent implements OnInit, OnDestroy {
  @Input() taskId!: string;
  newComment: string = '';
  private destroy$ = new Subject<void>();
  hoveredComment: any = null;
  @ViewChild('commentInput') commentInput!: ElementRef;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  get comments$() {
    return this.commentService.comments$;
  }

  ngOnInit() {
    this.commentService.startPolling(this.taskId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.commentService.stopPolling(this.taskId);
  }

  onPostComment() {
    if (this.newComment.trim()) {
      this.commentService
        .addComment(this.taskId, this.newComment)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.newComment = '';
          },
          error: (error) => console.error('Error posting comment:', error),
        });
    }
  }

  editComment(comment: any) {
    const dialogRef = this.dialog.open(EditCommentDialogComponent, {
      width: '400px',
      data: { comment, taskId: this.taskId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentService
          .editComment(this.taskId, comment.id, comment.text)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {},
            error: (error) => console.error('Error editing comment:', error),
          });
      }
    });
  }

  deleteComment(commentId: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService
        .deleteComment(this.taskId, commentId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {},
          error: (error) => console.error('Error deleting comment:', error),
        });
    }
  }

  getAvatarColor(userName: string): string {
    const colors = ['#1976d2', '#388e3c', '#f44336', '#e91e63', '#9c27b0'];
    const index = userName?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  }

  canEditComment(comment: any): boolean {
    const user = this.authService.getCurrentUser();
    return (
      user && (user.userName === comment.userName || this.authService.isAdmin())
    );
  }
}
