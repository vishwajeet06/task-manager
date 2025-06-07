import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Task } from '../../../core/models/task';

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
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent {
  task: Omit<Task, 'id'>;
  dueDate: Date;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    if (data) {
      this.task = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        status: data.status,
        category: data.category,
      };
      this.dueDate = new Date(data.dueDate);
    } else {
      this.task = {
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        status: 'To Do',
        category: '',
      };
      this.dueDate = new Date();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.task.dueDate = this.dueDate.toISOString().split('T')[0];
    this.dialogRef.close(this.task);
  }
}
