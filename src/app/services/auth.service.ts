import { inject, Injectable } from '@angular/core';
import { SignUp } from '../models/signup.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { API_URL } from './api.tokens';
import { SignIn } from '../models/signin.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = inject(API_URL);
  private httpClient = inject(HttpClient);

  private userService = inject(UserService);

  signUp(user: SignUp): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/register`, user);
  }

  signIn(user: SignIn): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/login`, user);
  }

  signOut(): void {
    this.userService.removeUser();
  }
}
