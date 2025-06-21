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
    MatInputModule
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
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    console.log('Component initialized'); // Debug: Lifecycle check
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('taskSlug');
    console.log('Fetched slug:', slug); // Debug: Log the slug
    if (slug) {
      this.taskService.getTaskBySlug(slug).subscribe({
        next: (task) => {
          console.log('Fetched task in subscribe:', task); // Debug: Log task
          this.task = task;
          this.cdr.detectChanges(); // Manually trigger change detection
        },
        error: (error) => {
          console.error('Error fetching task:', error); // Debug: Log any errors
          this.router.navigate(['/tasks']); // Redirect if task not found
        },
      });
    } else {
      console.log('No slug found, redirecting to /tasks');
      this.router.navigate(['/tasks']);
    }
  }

  ngOnDestroy() {
    console.log('Component destroyed'); // Debug: Lifecycle check
  }
}