import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from '../../../core/models/task';
import { TaskActions } from '../../../core/state/task.actions';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from '../../../core/state/task.selectors';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
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
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit() {
    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
    this.store.dispatch(TaskActions.loadTasks());

    this.tasks$.subscribe((tasks) => {
      this.dataSource.data = tasks;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData(sort: Sort) {
    this.dataSource.sort = this.sort;
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
          this.store.dispatch(TaskActions.addTask({ task: result }));
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
            TaskActions.updateTask({ id: task.id, task: result })
          );
        }
      });
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }
}
