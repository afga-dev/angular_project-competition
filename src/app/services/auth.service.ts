import { inject, Injectable } from '@angular/core';
import { SignUp } from '../models/signup.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { API_URL } from './api.tokens';
import { SignIn } from '../models/signin.interface';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = inject(API_URL);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private userService = inject(UserService);

  signUp(user: SignUp): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/register`, user);
  }

  signIn(user: SignIn): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/login`, user);
  }

  async signOutAndRedirect(): Promise<void> {
    this.userService.deleteUser();

    const currentUrl = this.router.url;
    const targetUrl = this.getPublicRedirectUrl(currentUrl);
    if (targetUrl !== currentUrl) {
      await this.router.navigateByUrl(targetUrl, { replaceUrl: true });
    } else {
      this.router.navigateByUrl(currentUrl);
    }
  }

  getPublicRedirectUrl(currentUrl: string): string {
    if (currentUrl.startsWith('/dashboard/admin')) return '/dashboard';
    return currentUrl;
  }
}
