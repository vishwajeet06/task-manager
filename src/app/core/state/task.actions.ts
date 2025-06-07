import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../models/task';

export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),
    'Add Task': props<{ task: Partial<Task> }>(),
    'Add Task Success': props<{ task: Task }>(),
    'Add Task Failure': props<{ error: string }>(),
    'Update Task': props<{ id: string; task: Partial<Task> }>(),
    'Update Task Success': props<{ id: string; task: Task }>(),
    'Update Task Failure': props<{ error: string }>(),
    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),
  },
});
