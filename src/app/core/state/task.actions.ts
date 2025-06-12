import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task';

export const loadTasks = createAction('[Task] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: string }>()
);

export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: Omit<Task, 'id'> }>()
);

export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);

export const addTaskFailure = createAction(
  '[Task] Add Task Failure',
  props<{ error: string }>()
);

export const updateTask = createAction(
  '[Task] Update Task',
  props<{ id: string; task: Omit<Task, 'id'> }>()
);

export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ id: string; task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Task] Update Task Failure',
  props<{ error: string }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: string }>()
);

// Add the logActivity action
export const logActivity = createAction(
  '[Task] Log Activity',
  props<{ taskId: string; action: string; details: string }>()
);
