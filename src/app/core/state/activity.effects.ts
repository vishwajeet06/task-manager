import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import {
  loadActivities,
  loadActivitiesSuccess,
  loadActivitiesFailure,
} from './activity.actions';

@Injectable()
export class ActivityEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);
  // Effect to handle the loadActivities action and fetch activities from the server
  loadActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActivities),
      switchMap(() =>
        this.taskService.getActivities().pipe(
          map((activities) => loadActivitiesSuccess({ activities })),
          catchError((error) =>
            of(loadActivitiesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //   constructor(private actions$: Actions, private taskService: TaskService) {}
}
