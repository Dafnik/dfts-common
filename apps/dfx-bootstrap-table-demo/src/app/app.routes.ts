import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./examples/all.component').then((c) => c.AllComponent) },
  { path: 'all', redirectTo: '' },
  { path: 'simple', loadComponent: () => import('./examples/simple.component').then((c) => c.SimpleComponent) },
  { path: 'ordering', loadComponent: () => import('./examples/ordering.component').then((c) => c.OrderingComponent) },
  { path: 'pagination', loadComponent: () => import('./examples/pagination.component').then((c) => c.PaginationComponent) },
  { path: 'filtering', loadComponent: () => import('./examples/filtering.component').then((c) => c.FilteringComponent) },
  { path: '**', redirectTo: '' },
];
