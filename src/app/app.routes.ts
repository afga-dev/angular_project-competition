import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component/dashboard.component';
import { HomeComponent } from './pages/home.component/home.component';
import { SigninComponent } from './pages/signin.component/signin.component';
import { SignupComponent } from './pages/signup.component/signup.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
