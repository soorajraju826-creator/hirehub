import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.currentUser() ? true : inject(Router).createUrlTree(['/login']);
};

export const roleGuard = (roles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const user = auth.currentUser();
  return user && roles.includes(user.role) ? true : inject(Router).createUrlTree(['/']);
};
