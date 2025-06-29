# Task Manager Developer Documentation

## Project Overview

Task Manager is an Angular application utilizing standalone components, NgRx for state management, and Angular Material for UI. The architecture includes services (e.g., `AuthService`, `TaskService`, `CommentService`, `NotificationService`), components (e.g., `LoginComponent`, `RegisterComponent`, `DashboardComponent`), and a global theme system managed via CSS variables. Data is fetched from a backend at `http://localhost:3000` and stored in an NgRx store for reactive updates.

## Component Structure

- **app.component**: Root component with `app-header` and `router-outlet`.
- **header.component**: Displays navigation and theme toggle, conditional on login state.
- **login.component**: Handles user authentication with a reactive form.
- **register.component**: Manages user registration with email, password, and username fields.
- **dashboard.component**: Displays task metrics, charts, and recent activities using NgRx state.

## Service Structure

- **AuthService**: Manages authentication (login, register, logout) and admin checks.
- **TaskService**: Handles CRUD operations for tasks and logging activities, interacting with `http://localhost:3000/tasks` and `http://localhost:3000/activities`.
- **CommentService**: Manages comments on tasks with CRUD operations and polling, using `http://localhost:3000/tasks`.
- **NotificationService**: Provides success/error notifications to users.

## NgRx State Management

### Task Feature

- **State**: `task.state.ts`
  - Interface: `TaskState` extends `EntityState<Task>` with `loading` and `error`.
  - Adapter: `taskAdapter` uses `task.id` as the selectId.
  - Initial State: `initialTaskState` with `loading: false` and `error: null`.
- **Actions**: `task.actions.ts`
  - `loadTasks`, `loadTasksSuccess`, `loadTasksFailure`, `addTask`, `addTaskSuccess`, `addTaskFailure`, `updateTask`, `updateTaskSuccess`, `updateTaskFailure`, `deleteTask`, `deleteTaskSuccess`, `deleteTaskFailure`, `logActivity`.
- **Reducer**: `task.reducer.ts`
  - Handles `loadTasks`, `loadTasksSuccess`, `loadTasksFailure`, `addTaskSuccess`, `updateTaskSuccess`, `deleteTaskSuccess` to update the task entity state.
- **Effects**: `task.effects.ts`
  - `loadTasks$`: Fetches tasks via `TaskService`.
  - `addTask$`: Adds a task and logs activity.
  - `updateTask$`: Updates a task and logs activity.
  - `deleteTask$`: Deletes a task and logs activity.
  - `logActivity$`: Logs activities via `TaskService`.
- **Selectors**: `task.selectors.ts`
  - `selectTaskState`: Feature selector.
  - `selectAllTasks`, `selectTasksLoading`, `selectTasksError`, `selectTotalTasks`, `selectCompletedTasks`, `selectOverdueTasks`: Derived selectors for dashboard metrics.

### Activity Feature

- **State**: `activity.reducer.ts`
  - Interface: `ActivityState` with `activities`, `loading`, and `error`.
  - Initial State: `initialState` with empty `activities`, `loading: false`, and `error: null`.
- **Actions**: `activity.actions.ts`
  - `loadActivities`, `loadActivitiesSuccess`, `loadActivitiesFailure`, `addActivity`, `logActivityFailure`.
- **Reducer**: `activity.reducer.ts`
  - Handles `loadActivities`, `loadActivitiesSuccess`, `loadActivitiesFailure`, `addActivity`, `logActivityFailure` to update activity state.
- **Effects**: `activity.effects.ts`
  - `loadActivities$`: Fetches activities via `TaskService`.
- **Selectors**: `activity.selectors.ts`
  - `selectActivityState`: Feature selector.
  - `selectActivities`, `selectActivityError`: Derived selectors for dashboard timeline.

## Key Features

### Login Component

- **File**: `src/app/auth/login/login.component.ts`
- **Purpose**: Manages user login with form validation and admin check.
- **Dependencies**: `AuthService` for login logic, `NotificationService` for feedback.
- **Theme Integration**: Uses global CSS variables (`--background`, `--text-color`) for dark/light mode, with responsive design for <480px.
- **Notes**: Form uses `ReactiveFormsModule`, redirects to `/tasks` for admins.

### Register Component

- **File**: `src/app/auth/register/register.component.ts`
- **Purpose**: Handles user registration with email, password, and username fields.
- **Dependencies**: `AuthService` for registration logic, `NotificationService` for feedback.
- **Theme Integration**: Uses global CSS variables for dark/light mode, with responsive design for <480px.
- **Notes**: Redirects to `/tasks` on success, checks for existing email.

### Dashboard Component

- **File**: `src/app/features/dashboard/dashboard.component.ts`
- **Purpose**: Displays task metrics, charts, and recent activities using NgRx state.
- **Dependencies**: `Store` for NgRx, `ng2-charts` for visualizations, `MatIconModule` for icons.
- **Theme Integration**: Uses global CSS variables for dark/light mode, with responsive design for <600px. Charts adapt with theme-aware legend colors.
- **NgRx Usage**: Subscribes to `selectAllTasks`, `selectActivities`, and derived selectors. Dispatches `loadTasks` and `loadActivities` on init and retry.
- **Notes**: Relies on `TaskService` and `CommentService` data via the store. Chart data is dynamically updated from `tasks$`.

## Architecture Notes

- **State Management**: NgRx manages tasks and activities with entity adapters for tasks and a simple array for activities. Effects handle API calls, and selectors provide derived data.
- **Theming**: Managed via CSS variables in `styles.css`, toggled with a `dark-theme` class on `body`.
- **Data Flow**: Services fetch data from `http://localhost:3000`, NgRx effects process it, and components consume it reactively.
- **Responsiveness**: Components use media queries (e.g., <480px for login/register, <600px for dashboard) for mobile optimization.

## Future Considerations

- Add `CommentComponent` to integrate `CommentService` with NgRx.
- Enhance activity state with an entity adapter for better scalability.
- Implement error handling middleware for consistent user feedback.

## Component Structure

- **app.component**: Root component with header and router outlet.
- **header.component**: Displays navigation and theme toggle, conditional on login state.
- **login.component**: Handles user authentication with a reactive form.

## Key Features

### Login Component

- **File**: `src/app/auth/login/login.component.ts`
- **Purpose**: Manages user login with form validation and admin check.
- **Dependencies**: `AuthService` for login logic, `NotificationService` for feedback.
- **Theme Integration**: Uses global CSS variables (`--background`, `--text-color`) for dark/light mode, with responsive design for <480px.
- **Notes**: Form uses `ReactiveFormsModule`, and input styles are customized globally in `styles.css`.

### Register Component

- **File**: `src/app/auth/register/register.component.ts`
- **Purpose**: Handles user registration with a reactive form, including email, password, and username fields.
- **Dependencies**: `AuthService` for registration logic, `NotificationService` for feedback.
- **Theme Integration**: Uses global CSS variables (`--background`, `--text-color`) for dark/light mode, with responsive design for <480px. Input styling is managed globally in `styles.css`.
- **Notes**: Similar to `LoginComponent`, with an additional `userName` field. Redirects to `/tasks` on success.

### Dashboard Component

- **File**: `src/app/features/dashboard/dashboard.component.ts`
- **Purpose**: Displays task metrics, charts, and recent activities using NgRx state.
- **Dependencies**: `Store` for NgRx, `ng2-charts` for visualizations, `MatIconModule` for icons.
- **Theme Integration**: Uses global CSS variables (`--background`, `--text-color`) for dark/light mode, with responsive design for <600px. Charts adapt with theme-aware legend colors.
- **NgRx Usage**: Subscribes to `selectAllTasks`, `selectActivities`, and derived selectors (e.g., `selectTotalTasks`). Dispatches `loadTasks` and `loadActivities` on init and retry.
- **Notes**: Relies on `TaskService` and `CommentService` data via the store. Chart data is dynamically updated from `tasks$`.

### TaskList Component

- **File**: `src/app/features/task-list/task-list.component.ts`
- **Purpose**: Displays a sortable, filterable table of tasks using NgRx state, with add/edit/delete functionality.
- **Dependencies**: `Store` for NgRx, `MatTableModule` for table, `MatDialog` for task dialog, `AuthService` for admin checks.
- **Theme Integration**: Uses global CSS variables (`--background`, `--text-color`) for dark/light mode, with responsive design for <600px.
- **NgRx Usage**: Subscribes to `selectAllTasks`, `selectTasksLoading`, `selectTasksError`. Dispatches `loadTasks`, `addTask`, `updateTask`, `deleteTask`.
- **Notes**: Implements reactive filtering with `combineLatest`, updates query params, and navigates to task comments via slugs.
