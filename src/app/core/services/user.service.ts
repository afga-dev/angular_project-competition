import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Stores the user's role (null = guest)
  private _user = signal<string | null>(null);
  readonly user = this._user.asReadonly();

  // Indicates whether the role has been loaded from storage
  private _isLoaded = signal<boolean>(false);
  readonly isLoaded = this._isLoaded.asReadonly();

  // Load role from localStorage on app start
  loadUserFromLocalStorage(): void {
    const storedRole = localStorage.getItem('role');
    if (storedRole) this._user.set(storedRole);
    this._isLoaded.set(true);
  }

  // Store user role and update signal
  setUser(user: User): void {
    localStorage.setItem('role', user.role.toString());
    this._user.set(user.role.toString());
  }

  // Clear stored role
  deleteUser(): void {
    localStorage.removeItem('role');
    this._user.set(null);
  }
}
