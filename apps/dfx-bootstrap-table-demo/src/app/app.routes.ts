import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/all', pathMatch: 'full' },
  { path: 'all', loadComponent: () => import('./examples/all.component').then((c) => c.AllComponent) },
  { path: 'simple', loadComponent: () => import('./examples/simple.component').then((c) => c.SimpleComponent) },
  { path: 'ordering', loadComponent: () => import('./examples/ordering.component').then((c) => c.OrderingComponent) },
  { path: 'pagination', loadComponent: () => import('./examples/pagination.component').then((c) => c.PaginationComponent) },
  { path: 'filtering', loadComponent: () => import('./examples/filtering.component').then((c) => c.FilteringComponent) },
  { path: '**', redirectTo: '/all' },
];
