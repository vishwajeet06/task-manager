import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskMockService } from '../services/task-mock.service';
import { TaskActions } from './task.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Task } from '../models/task';

@Injectable()
export class TaskEffects {
  private readonly actions$ = inject(Actions);
  private readonly taskMockService = inject(TaskMockService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() => {
        console.log('Effect triggered: Loading tasks...');
        // Assuming getTasks() returns an Observable<Task[]>
        return this.taskMockService.getTasks().pipe(
          map((tasks: Task[]) => TaskActions.loadTasksSuccess({ tasks })), // Explicitly type tasks
          catchError((error: any) =>
            of(
              TaskActions.loadTasksFailure({
                error: error.message || 'Unknown error',
              })
            )
          )
        );
      })
    )
  );
}
