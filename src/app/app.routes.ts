import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feature-manager-task/dashboard.page').then(
            (c) => c.DashboardPageComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/Task_Manager/list-task/list-task.component').then(
            (c) => c.ListTaskComponent
          ),
      },
      {
        path: 'tasks/create',
        loadComponent: () =>
          import(
            './features/Task_Manager/create-update-form/create-update-form.component'
          ).then((c) => c.CreateUpdateFormComponent),
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () =>
          import(
            './features/Task_Manager/create-update-form/create-update-form.component'
          ).then((c) => c.CreateUpdateFormComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];

