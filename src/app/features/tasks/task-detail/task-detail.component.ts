import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../core/models/task';
import { TaskService } from '../../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TaskCommentsComponent } from '../task-comments/task-comments.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    CommonModule,
    MatChipsModule,
    TaskCommentsComponent,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    console.log('Component initialized');
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('taskSlug');
    const uniqueId = this.route.snapshot.paramMap.get('uniqueId');
    console.log('Fetched slug:', slug, 'uniqueId:', uniqueId);

    if (uniqueId) {
      // Fetch by uniqueId if available (new sharing route)
      this.taskService.getTasks().subscribe((tasks) => {
        const task = tasks.find((t: Task) => t.uniqueId === uniqueId);
        console.log('Fetched task by uniqueId:', task);
        this.task = task || null;
        this.cdr.detectChanges();
      });
    } else if (slug) {
      // Fallback to slug-based fetching
      this.taskService.getTaskBySlug(slug).subscribe({
        next: (task) => {
          console.log('Fetched task in subscribe:', task);
          this.task = task;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching task:', error);
          this.router.navigate(['/tasks']);
        },
      });
    } else {
      console.log('No slug or uniqueId found, redirecting to /tasks');
      this.router.navigate(['/tasks']);
    }
  }

  shareTask() {
    if (this.task?.uniqueId) {
      const url = `${window.location.origin}/tasks/detail/${this.task.uniqueId}`;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.snackBar.open('Task URL copied to clipboard!', 'Close', {
            duration: 2000,
            panelClass: ['snackbar-success'],
          });
        })
        .catch((err) => {
          this.snackBar.open('Failed to copy URL', 'Close', {
            duration: 2000,
            panelClass: ['snackbar-error'],
          });
          console.error('Clipboard error:', err);
        });
    } else {
      this.snackBar.open('Task URL not available', 'Close', {
        duration: 2000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  ngOnDestroy() {
    console.log('Component destroyed');
  }
}
