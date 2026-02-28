import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleType } from '../../views/system/models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.currentUser) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.currentUser) return router.createUrlTree(['/login']);
  const requiredRoles = route.data['roles'] as RoleType[];
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (authService.hasAnyRole(requiredRoles)) return true;
  return router.createUrlTree(['/unauthorized']);
};
