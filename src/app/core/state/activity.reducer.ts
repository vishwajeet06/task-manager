import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/activity';
import {
  loadActivities,
  loadActivitiesSuccess,
  loadActivitiesFailure,
  addActivity,
  logActivityFailure,
} from './activity.actions';

export interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

export const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

export const activityReducer = createReducer(
  initialState,
  on(loadActivities, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadActivitiesSuccess, (state, { activities }) => ({
    ...state,
    activities,
    loading: false,
    error: null,
  })),
  on(loadActivitiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addActivity, (state, { activity }) => ({
    ...state,
    activities: [activity, ...state.activities],
  })),
  on(logActivityFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
