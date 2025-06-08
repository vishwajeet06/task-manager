import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task';
import { TaskActions } from './task.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
}

export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  selectId: (task) => task.id,
});

export const initialTaskState: TaskState = taskAdapter.getInitialState({
  loading: false,
  error: null,
});

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
  })),
  on(TaskActions.addTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, {
      ...state,
    })
  ),
  on(TaskActions.updateTaskSuccess, (state, { id, task }) =>
    taskAdapter.updateOne({ id, changes: task }, { ...state })
  ),
  on(TaskActions.deleteTaskSuccess, (state, { id }) =>
    taskAdapter.removeOne(id, {
      ...state,
    })
  )
);
