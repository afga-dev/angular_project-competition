import { inject, Injectable, signal } from '@angular/core';
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

  // Controls footer visibility across pages
  private _isFooterVisible = signal<boolean>(false);
  readonly isFooterVisible = this._isFooterVisible.asReadonly();

  signUp(user: SignUp): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/register`, user);
  }

  signIn(user: SignIn): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/login`, user);
  }

  async signOutAndRedirect(): Promise<void> {
    this.userService.deleteUser();

    const targetUrl = this.getPublicRedirectUrl(this.router.url);

    await this.router.navigateByUrl(targetUrl, { replaceUrl: true });
  }

  // Ensures users leaving protected pages are redirected to a safe public URL after logout
  getPublicRedirectUrl(currentUrl: string): string {
    if (currentUrl.startsWith('/dashboard/admin')) return '/dashboard';
    return currentUrl;
  }

  setFooterVisible(state: boolean): void {
    this._isFooterVisible.set(state);
  }
}
