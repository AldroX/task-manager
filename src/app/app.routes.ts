import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
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
];
