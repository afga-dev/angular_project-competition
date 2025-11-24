import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SignUp } from '../../core/models/signup.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.interface';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../auth.style.css'],
})
export class SignupComponent implements OnInit {
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
    collegeName: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.authService.setFooterVisible(true);
  }

  async onSubmit() {
    try {
      const signUp: SignUp = this.signUpForm.getRawValue();
      signUp.collegeName = signUp.collegeName.trim();
      signUp.fullName = signUp.fullName.trim();
      signUp.email = signUp.email.trim();
      signUp.password = signUp.password.trim();

      if (this.signUpForm.invalid || this._isLoading()) return;

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

  hasError(controlName: string, error: string): boolean {
    const control = this.signUpForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
