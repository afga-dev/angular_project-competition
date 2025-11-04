import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = signal<string | null>(null);
  readonly user = this._user.asReadonly();

  private _isLoaded = signal<boolean>(false);
  readonly isLoaded = this._isLoaded.asReadonly();

  loadUserFromLocalStorage(): void {
    const storedRole = localStorage.getItem('role');
    if (storedRole) this._user.set(storedRole);
    this._isLoaded.set(true);
  }

  setUser(user: User): void {
    localStorage.setItem('role', user.role.toString());
    this._user.set(user.role.toString());
  }

  removeUser(): void {
    localStorage.removeItem('role');
    this._user.set(null);
  }
}
