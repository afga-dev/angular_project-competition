import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SignIn } from '../../models/signin.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css', '../../shared/auth.style.css'],
})
export class SigninComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);
  private userService = inject(UserService);

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  showPassword = false;

  readonly signInForm = this.formBuilder.nonNullable.group({
    email: [
      '',
      [Validators.required, Validators.maxLength(254), Validators.email],
    ],
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  async onSubmit() {
    try {
      const signIn: SignIn = this.signInForm.getRawValue();
      signIn.email = signIn.email.trim();
      signIn.password = signIn.password.trim();

      if (this.signInForm.invalid || this._isLoading() || !signIn) return;

      this._isLoading.set(true);

      const user = await firstValueFrom(this.authService.signIn(signIn));
      this.userService.setUser(user);

      this.router.navigateByUrl('/dashboard');
    } catch (err) {
      this._error.set('Incorrect email or password.');
      // console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }

  // Helper for form validation state
  hasError(controlName: string, error: string): boolean {
    const control = this.signInForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
