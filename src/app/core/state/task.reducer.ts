import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task';
// import { TaskActions } from './task.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  addTaskSuccess,
  deleteTaskSuccess,
  loadTasks,
  loadTasksFailure,
  loadTasksSuccess,
  updateTaskSuccess,
} from './task.actions';

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
  on(loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadTasksSuccess, (state, { tasks }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, {
      ...state,
    })
  ),
  on(updateTaskSuccess, (state, { id, task }) =>
    taskAdapter.updateOne({ id, changes: task }, { ...state })
  ),
  on(deleteTaskSuccess, (state, { id }) =>
    taskAdapter.removeOne(id, {
      ...state,
    })
  )
);
