import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskMockService } from '../services/task-mock.service';
import { TaskActions } from './task.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Task } from '../models/task';

@Injectable()
export class TaskEffects {
  private readonly actions$ = inject(Actions);
  private readonly taskService = inject(TaskMockService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) => {
        const completeTask: Omit<Task, 'id'> = {
          title: task.title ?? '',
          description: task.description ?? '',
          priority: task.priority ?? 'Medium',
          dueDate: task.dueDate ?? new Date().toISOString().split('T')[0],
          status: task.status ?? 'To Do',
          category: task.category ?? '',
          tags: task.tags ?? [],
          assignedTo: task.assignedTo ?? '',
          attachments: task.attachments ?? [],
        };
        return this.taskService.addTask(completeTask).pipe(
          map((newTask) => TaskActions.addTaskSuccess({ task: newTask })),
          catchError((error) =>
            of(TaskActions.addTaskFailure({ error: error.message }))
          )
        );
      })
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, task }) => {
        const completeTask: Omit<Task, 'id'> = {
          title: task.title ?? '',
          description: task.description ?? '',
          priority: task.priority ?? 'Medium',
          dueDate: task.dueDate ?? new Date().toISOString().split('T')[0],
          status: task.status ?? 'To Do',
          category: task.category ?? '',
          tags: task.tags ?? [],
          assignedTo: task.assignedTo ?? '',
          attachments: task.attachments ?? [],
        };
        return this.taskService.updateTask(id, completeTask).pipe(
          map((updatedTask) =>
            TaskActions.updateTaskSuccess({ id, task: updatedTask })
          ),
          catchError((error) =>
            of(TaskActions.updateTaskFailure({ error: error.message }))
          )
        );
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) =>
            of(TaskActions.deleteTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
