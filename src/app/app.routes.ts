import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(c => c.LayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./feature-manager-task/dashboard.page').then(c => c.DashboardPageComponent),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./feature-manager-task/task-management.page').then(c => c.TaskManagementPageComponent),
      },
    ],
  },
];
