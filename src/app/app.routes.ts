import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component/home.component';
import { guestGuard } from './core/guards/guest-guard.guard';
import { authGuard } from './core/guards/auth-guard.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        canActivate: [guestGuard],
        loadComponent: () =>
          import(
            './pages/dashboard/dashboard.component/dashboard.component'
          ).then((c) => c.Dashboard),
      },
      {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './pages/dashboard/dashboard-admin.component/dashboard-admin.component'
          ).then((c) => c.DashboardAdmin),
      },
    ],
  },
  {
    path: 'signin',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/signin.component/signin.component').then(
        (c) => c.SigninComponent
      ),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/signup.component/signup.component').then(
        (c) => c.SignupComponent
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
