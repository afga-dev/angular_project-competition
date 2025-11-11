import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './pages/competitions-list.component/competitions-list.component'
      ).then((c) => c.CompetitionsList),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/signin.component/signin.component').then(
        (c) => c.SigninComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup.component/signup.component').then(
        (c) => c.SignupComponent
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
