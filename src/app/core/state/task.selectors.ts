import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState, taskAdapter } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const { selectAll: selectAllTasks } =
  taskAdapter.getSelectors(selectTaskState);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTasksError = createSelector(
  selectTaskState,
  (state) => state.error
);
