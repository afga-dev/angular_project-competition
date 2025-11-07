import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SignUp } from '../../models/signup.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../shared/auth.style.css'],
})
export class SignupComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);
  private userService = inject(UserService);

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  showPassword = false;

  readonly signUpForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: [
      '',
      [Validators.required, Validators.maxLength(254), Validators.email],
    ],
    password: ['', [Validators.required, Validators.maxLength(128)]],
    collegeName: ['', Validators.required, Validators.maxLength(100)],
  });

  async onSubmit() {
    try {
      const signUp: SignUp = this.signUpForm.getRawValue();
      signUp.collegeName = signUp.collegeName.trim();
      signUp.fullName = signUp.fullName.trim();
      signUp.email = signUp.email.trim();
      signUp.password = signUp.password.trim();

      if (this.signUpForm.invalid || this._isLoading() || !signUp) return;

      this._isLoading.set(true);

      await firstValueFrom(this.authService.signUp(signUp));
      this.userService.setUser({
        userId: 0,
        fullName: '',
        email: '',
        collegeName: '',
        role: 'user',
      } as User);

      this.router.navigateByUrl('/dashboard');
    } catch (err) {
      this._error.set('Email is already registered.');
      // console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }

  // Helper for form validation state
  hasError(controlName: string, error: string): boolean {
    const control = this.signUpForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
