import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Task } from '../models/task';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
}

export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  selectId: (task: Task) => task.id,
});

export const initialTaskState: TaskState = taskAdapter.getInitialState({
  loading: false,
  error: null,
});
