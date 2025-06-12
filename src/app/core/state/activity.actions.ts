import { createAction, props } from '@ngrx/store';
import { Activity } from '../models/activity';

export const loadActivities = createAction('[Activity] Load Activities');

export const loadActivitiesSuccess = createAction(
  '[Activity] Load Activities Success',
  props<{ activities: Activity[] }>()
);

export const loadActivitiesFailure = createAction(
  '[Activity] Load Activities Failure',
  props<{ error: string }>()
);

export const addActivity = createAction(
  '[Activity] Add Activity',
  props<{ activity: Activity }>()
);

export const logActivityFailure = createAction(
  '[Activity] Log Activity Failure',
  props<{ error: string }>()
);
