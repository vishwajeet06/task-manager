import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tasks/:taskSlug', // Existing route for slug-based navigation
    loadComponent: () =>
      import('./features/tasks/task-detail/task-detail.component').then(
        (m) => m.TaskDetailComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tasks/detail/:uniqueId', // New route for uniqueId-based sharing
    loadComponent: () =>
      import('./features/tasks/task-detail/task-detail.component').then(
        (m) => m.TaskDetailComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/task-list/task-list.component').then(
        (m) => m.TaskListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login' }, // Fallback route
];
