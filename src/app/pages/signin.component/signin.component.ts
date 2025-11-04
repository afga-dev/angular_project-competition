import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SignIn } from '../../models/signin.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly signinError = signal<string | null>(null);

  showPassword = false;

  readonly signinForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.signinForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }

  async submitSigninForm() {
    if (this.signinForm.invalid || this.isSubmitting()) return;

    const signinData: SignIn = this.signinForm.getRawValue();

    this.isSubmitting.set(true);
    this.signinError.set(null);

    try {
      const user = await firstValueFrom(this.authService.signIn(signinData));
      this.userService.setUser(user);
    } catch (err) {
      this.signinError.set(`Email and/or password doesn't match.`);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
