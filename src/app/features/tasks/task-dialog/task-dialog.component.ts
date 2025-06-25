import { QuillModule } from 'ngx-quill';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Task } from '../../../core/models/task';
import { Observable } from 'rxjs';
import {
  TeamMember,
  UserMockService,
} from '../../../core/services/user-mock.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    QuillModule,
    MatIcon,
    CommonModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent {
  task: Omit<Task, 'id'>;
  dueDate: Date;
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };
  teamMembers$!: Observable<TeamMember[]>;
  tagsInput: string = '';

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null,
    private userService: UserMockService
  ) {
    this.teamMembers$ = this.userService.getTeamMembers();

    if (data) {
      this.task = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        status: data.status,
        category: data.category,
        tags: data.tags,
        assignedTo: data.assignedTo,
        attachments: data.attachments,
        uniqueId: data.uniqueId,
      };
      this.dueDate = new Date(data.dueDate);
      this.tagsInput = data.tags.join(', ');
    } else {
      this.task = {
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        status: 'To Do',
        category: '',
        tags: [],
        assignedTo: '',
        uniqueId: '',
        attachments: [],
      };
      this.dueDate = new Date();
    }
  }

  updateTags() {
    this.task.tags = this.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newAttachments = Array.from(input.files).map((file) => ({
        name: file.name,
        size: file.size,
      }));
      this.task.attachments = [...this.task.attachments, ...newAttachments];
      input.value = ''; // Reset the input
    }
  }

  removeAttachment(attachment: { name: string; size: number }) {
    this.task.attachments = this.task.attachments.filter(
      (att) => att !== attachment
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.task.dueDate = this.dueDate.toISOString().split('T')[0];
    this.dialogRef.close(this.task);
  }
}
