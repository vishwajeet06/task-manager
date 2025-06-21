import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from '../../../core/models/task';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from '../../../core/state/task.selectors';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  Subject,
} from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import {
  addTask,
  deleteTask,
  loadTasks,
  updateTask,
} from '../../../core/state/task.actions';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$!: Observable<Task[]>;
  isAdmin$!: Observable<boolean>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  dataSource = new MatTableDataSource<Task>();
  displayedColumns: string[] = [
    'title',
    'description',
    'priority',
    'dueDate',
    'status',
    'category',
    'tags',
    'assignedTo',
    'attachments',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  searchSubject = new BehaviorSubject<string>('');
  statusControl = new FormControl<string>('');
  priorityControl = new FormControl<string>('');
  categoryControl = new FormControl<string>('');
  private destroy$ = new Subject<void>();

  categories: string[] = [];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tasks$ = this.store.select(selectAllTasks);
    this.isAdmin$ = this.authService.isAdmin();
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
    this.store.dispatch(loadTasks());

    // Initialize FormControls with query params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.statusControl.setValue(params['status'] || '', {
          emitEvent: false,
        });
        this.priorityControl.setValue(params['priority'] || '', {
          emitEvent: false,
        });
        this.categoryControl.setValue(params['category'] || '', {
          emitEvent: false,
        });
        this.searchSubject.next(params['search'] || '');
      });

    // Extract unique categories from tasks
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.categories = [
        ...new Set(
          tasks.map((task) => task.category).filter((category) => category)
        ),
      ];
    });

    const search$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      takeUntil(this.destroy$)
    );

    const status$ = this.statusControl.valueChanges.pipe(
      startWith(this.statusControl.value),
      takeUntil(this.destroy$)
    );

    const priority$ = this.priorityControl.valueChanges.pipe(
      startWith(this.priorityControl.value),
      takeUntil(this.destroy$)
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith(this.categoryControl.value),
      takeUntil(this.destroy$)
    );

    // Combine filters and update table
    combineLatest([this.tasks$, search$, status$, priority$, category$])
      .pipe(
        map(([tasks, searchTerm, status, priority, category]) => {
          let filteredTasks = tasks;

          // Apply search filter
          if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filteredTasks = filteredTasks.filter(
              (task) =>
                task.title.toLowerCase().includes(lowerTerm) ||
                task.description.toLowerCase().includes(lowerTerm) ||
                task.category.toLowerCase().includes(lowerTerm) ||
                task.tags.some((tag) =>
                  tag.toLowerCase().includes(lowerTerm)
                ) ||
                task.assignedTo.toLowerCase().includes(lowerTerm)
            );
          }

          // Apply status filter
          if (status) {
            filteredTasks = filteredTasks.filter(
              (task) => task.status === status
            );
          }

          // Apply priority filter
          if (priority) {
            filteredTasks = filteredTasks.filter(
              (task) => task.priority === priority
            );
          }

          // Apply category filter
          if (category) {
            filteredTasks = filteredTasks.filter(
              (task) => task.category === category
            );
          }

          return filteredTasks;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((filteredTasks) => {
        this.dataSource.data = filteredTasks;
        this.dataSource.sort = this.sort;
      });

    // Update query params when filters change
    combineLatest([search$, status$, priority$, category$])
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(([searchTerm, status, priority, category]) => {
        const queryParams: { [key: string]: string | null } = {
          search: searchTerm || null,
          status: status || null,
          priority: priority || null,
          category: category || null,
        };

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sortData(sort: Sort) {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchSubject.next(target.value);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: null,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: Omit<Task, 'id'> | undefined) => {
        if (result) {
          this.store.dispatch(addTask({ task: result as Omit<Task, 'id'> }));
        }
      });
  }

  openEditDialog(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: Omit<Task, 'id'> | undefined) => {
        if (result) {
          this.store.dispatch(
            updateTask({
              id: task.id,
              task: result as Omit<Task, 'id'>,
            })
          );
        }
      });
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(deleteTask({ id }));
    }
  }

  isOverdue(dueDate: string): boolean {
    const currentDate = new Date('2025-06-15'); // Current date as of June 15, 2025
    const taskDueDate = new Date(dueDate);
    return taskDueDate < currentDate;
  }

  generateSlug(title: string): string {
    return title.toLowerCase().replace(/ /g, '-');
  }

  // New method to navigate to task details for comments
  onComment(task: Task) {
    const slug = this.generateSlug(task.title);
    this.router.navigate(['/tasks', slug]);
  }
}
