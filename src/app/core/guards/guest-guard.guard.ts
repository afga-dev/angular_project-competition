import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userService = inject(UserService);

  return userService.user() ? router.navigate(['/dashboard/admin']) : true;
};
