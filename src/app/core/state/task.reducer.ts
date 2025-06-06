import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { TaskState, taskAdapter, initialTaskState } from './task.state';

export const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
