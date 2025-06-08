import { createActionGroup, props } from '@ngrx/store';
import { Activity } from '../models/activity';

export const ActivityActions = createActionGroup({
  source: 'Activity',
  events: {
    'Log Activity': props<{ activity: Activity }>(),
  },
});
