import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, switchMap } from 'rxjs/operators'; // Add mergeMap
import { TaskService } from '../services/task.service';
import {
  loadTasks,
  loadTasksSuccess,
  loadTasksFailure,
  addTask,
  addTaskSuccess,
  addTaskFailure,
  updateTask,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure,
  logActivity,
} from './task.actions';
import { addActivity, logActivityFailure } from './activity.actions';
import { Task } from '../models/task';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          map((tasks) => loadTasksSuccess({ tasks })),
          catchError((error) => of(loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTask),
      switchMap(({ task }) =>
        this.taskService.addTask(task).pipe(
          switchMap((newTask) => [
            addTaskSuccess({ task: newTask }),
            logActivity({
              taskId: newTask.id,
              action: 'Task Created',
              details: `Task "${newTask.title}" was created.`,
            }),
          ]),
          catchError((error) => of(addTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTask),
      switchMap(({ id, task }) =>
        this.taskService.updateTask(id, task).pipe(
          switchMap((updatedTask) => [
            updateTaskSuccess({ id, task: updatedTask }),
            logActivity({
              taskId: updatedTask.id,
              action: 'Task Updated',
              details: `Task "${updatedTask.title}" was updated.`,
            }),
          ]),
          catchError((error) => of(updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  // deleteTask$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(deleteTask),
  //     switchMap(({ id }) =>
  //       this.taskService.deleteTask(id).pipe(
  //         switchMap(() => [
  //           deleteTaskSuccess({ id }),
  //           logActivity({
  //             taskId: id,
  //             action: 'Task Deleted',
  //             details: `Task with ID ${id} was deleted.`,
  //           }),
  //         ]),
  //         catchError((error) => of(deleteTaskFailure({ error: error.message })))
  //       )
  //     )
  //   )
  // );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),
      switchMap(({ id }) =>
        this.taskService.getTasks().pipe(
          // Fetch all tasks to find the one to delete
          map((tasks: Task[]) => tasks.find((task) => task.id === id)),
          switchMap((task) => {
            if (!task) {
              // If task not found, dispatch failure
              return of(
                deleteTaskFailure({ error: `Task with ID ${id} not found.` })
              );
            }
            return this.taskService.deleteTask(id).pipe(
              switchMap(() => [
                deleteTaskSuccess({ id }),
                logActivity({
                  taskId: id,
                  action: 'Task Deleted',
                  details: `Task "${task.title}" with ID ${id} was deleted.`, // Include task title
                }),
              ]),
              catchError((error) =>
                of(deleteTaskFailure({ error: error.message }))
              )
            );
          })
        )
      )
    )
  );

  logActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logActivity),
      mergeMap(
        (
          { taskId, action, details } // Changed switchMap to mergeMap
        ) =>
          this.taskService.logActivity(taskId, action, details).pipe(
            map((activity) => addActivity({ activity })),
            catchError((error) =>
              of(logActivityFailure({ error: error.message }))
            )
          )
      )
    )
  );

  // constructor(private actions$: Actions, private taskService: TaskService) {}
}
