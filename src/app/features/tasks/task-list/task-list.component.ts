import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskMockService } from '../../../core/services/task-mock.service';
import { Task } from '../../../core/models/task';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TaskActions } from '../../../core/state/task.actions';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from '../../../core/state/task.selectors';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
// export class TaskListComponent implements OnInit {
//   tasks: Task[] = [];

//   constructor(private taskMockService: TaskMockService) {}

//   ngOnInit() {
//     this.tasks = this.taskMockService.getTasks();
//   }
// }
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
    this.store.dispatch(TaskActions.loadTasks());
  }
}
