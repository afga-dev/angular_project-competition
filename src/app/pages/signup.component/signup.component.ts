import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { UserSignupInterface } from '../../models/user-signup.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly signupMessage = signal<string | null>(null);
  readonly signupError = signal<string | null>(null);

  showPassword = false;

  readonly signupForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    collegeName: ['', Validators.required],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }

  async submitSignupForm() {
    if (this.signupForm.invalid || this.isSubmitting()) return;

    const signupData: UserSignupInterface = this.signupForm.getRawValue();

    this.isSubmitting.set(true);
    this.signupMessage.set(null);
    this.signupError.set(null);

    try {
      await firstValueFrom(this.userService.onSignup(signupData));
      this.signupMessage.set('Sign up successful!');
      this.clearSignupForm();
    } catch (err) {
      this.signupError.set('Email is already registered.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  clearSignupForm() {
    this.signupForm.reset();
    this.signupForm.markAsPristine();
    this.signupForm.markAsUntouched();
  }
}
