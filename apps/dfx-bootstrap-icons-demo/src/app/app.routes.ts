import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./home.component').then((c) => c.HomeComponent) },
  { path: '**', redirectTo: '' },
];
