import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserSigninInterface } from '../../models/user-signin.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
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

    const signinData: UserSigninInterface = this.signinForm.getRawValue();

    this.isSubmitting.set(true);
    this.signinError.set(null);

    try {
      const user = await firstValueFrom(this.userService.onSignin(signinData));
      this.userService.setSignedupResponse(user);
    } catch (err) {
      this.signinError.set(`Email and/or password doesn't match.`);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
