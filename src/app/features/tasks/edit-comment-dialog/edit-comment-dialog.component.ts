import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommentService } from '../../../core/services/comment.service';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.scss'],
  standalone: true,
  imports: [MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
})
export class EditCommentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comment: any; taskId: string },
    private commentService: CommentService
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.commentService
      .editComment(
        this.data.taskId,
        this.data.comment.id,
        this.data.comment.text
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Error saving comment:', error),
      });
  }
}
