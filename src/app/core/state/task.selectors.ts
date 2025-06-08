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

export const selectTotalTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.length
);

export const selectCompletedTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter((task) => task.status === 'Completed').length
);

export const selectOverdueTasks = createSelector(selectAllTasks, (tasks) => {
  const today = new Date('2025-06-08');
  return tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Completed';
  }).length;
});
