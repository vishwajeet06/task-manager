import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActivityState } from './activity.reducer';

export const selectActivityState =
  createFeatureSelector<ActivityState>('activity');

export const selectActivities = createSelector(
  selectActivityState,
  (state: ActivityState) => state.activities
);

export const selectActivityError = createSelector(
  selectActivityState,
  (state: ActivityState) => state.error
);
