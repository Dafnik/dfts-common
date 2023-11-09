import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./home.component').then((c) => c.HomeComponent) },
  { path: 'usage', loadComponent: () => import('./usage.component').then((c) => c.UsageComponent) },
  { path: '**', redirectTo: '' },
];
