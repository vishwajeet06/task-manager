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
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    QuillModule,
  ],
})
export class EditCommentDialogComponent {
  originalText!: string;
  editedText!: string;
  charCount: number = 0;
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };
  constructor(
    public dialogRef: MatDialogRef<EditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comment: any; taskId: string },
    private commentService: CommentService
  ) {
    this.originalText = this.data.comment.text || '';
    this.editedText = this.originalText;
    this.charCount = this.getCharCount(this.data.comment.text || '');
  }

  getCharCount(html: string): number {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent?.length || 0;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSave() {
    if (this.charCount <= 500) {
      this.data.comment.text = this.editedText;
      this.commentService
        .editComment(this.data.taskId, this.data.comment.id, this.editedText)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error saving comment:', error),
        });
    }
  }
}
