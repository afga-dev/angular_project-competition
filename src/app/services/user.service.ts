import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { UserSigninInterface } from '../models/user-signin.interface';
import { UserSignupInterface } from '../models/user-signup.interface';
import { API_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = inject(API_URL);

  signedupResponse = signal<UserInterface | null>(
    JSON.parse(localStorage.getItem('response') || 'null')
  );

  setSignedupResponse(response: UserInterface) {
    localStorage.setItem('response', JSON.stringify(response));
    this.signedupResponse.set(response);
    this.router.navigateByUrl('/dashboard');
  }

  onSignup(signupData: UserSignupInterface): Observable<UserInterface> {
    return this.httpClient.post<UserInterface>(
      `${this.baseUrl}/register`,
      signupData
    );
  }

  onSignin(signinData: UserSigninInterface): Observable<UserInterface> {
    return this.httpClient.post<UserInterface>(
      `${this.baseUrl}/login`,
      signinData
    );
  }

  onSignout() {
    localStorage.removeItem('response');
    this.signedupResponse.set(null);
    this.router.navigateByUrl('/signin');
  }
}
