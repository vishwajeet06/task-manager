import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../models/task';

export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),
  },
});
