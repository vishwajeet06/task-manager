import { createReducer, on } from '@ngrx/store';
import { ActivityActions } from './activity.actions';
import { Activity } from '../models/activity';

export interface ActivityState {
  activities: Activity[];
}

export const initialActivityState: ActivityState = {
  activities: [],
};

export const activityReducer = createReducer(
  initialActivityState,
  on(ActivityActions.logActivity, (state, { activity }) => ({
    ...state,
    activities: [activity, ...state.activities].slice(0, 10), // Keep only the latest 10 activities
  }))
);
