import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskMockService } from '../services/task-mock.service';
import { TaskActions } from './task.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TaskEffects {
  private readonly actions$ = inject(Actions);
  private readonly taskMockService = inject(TaskMockService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() => {
        console.log('Effect triggered: Loading tasks...');
        return this.taskMockService.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
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

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) =>
        this.taskMockService.addTask(task).pipe(
          map((newTask) => TaskActions.addTaskSuccess({ task: newTask })),
          catchError((error: any) =>
            of(
              TaskActions.addTaskFailure({
                error: error.message || 'Unknown error',
              })
            )
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, task }) =>
        this.taskMockService.updateTask(id, task).pipe(
          map((updatedTask) =>
            updatedTask
              ? TaskActions.updateTaskSuccess({ task: updatedTask })
              : TaskActions.updateTaskFailure({ error: 'Task not found' })
          ),
          catchError((error: any) =>
            of(
              TaskActions.updateTaskFailure({
                error: error.message || 'Unknown error',
              })
            )
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.taskMockService.deleteTask(id).pipe(
          map((success) =>
            success
              ? TaskActions.deleteTaskSuccess({ id })
              : TaskActions.deleteTaskFailure({ error: 'Task not found' })
          ),
          catchError((error: any) =>
            of(
              TaskActions.deleteTaskFailure({
                error: error.message || 'Unknown error',
              })
            )
          )
        )
      )
    )
  );
}
