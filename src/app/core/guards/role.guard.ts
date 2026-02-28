import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleType } from '../../views/system/models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar si el usuario está autenticado
  if (!authService.currentUser) {
    return router.createUrlTree(['/login']);
  }
  
  // Obtener roles requeridos para la ruta
  const requiredRoles = route.data['roles'] as RoleType[];
  
  // Si no hay roles requeridos, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  // Verificar si el usuario tiene al menos uno de los roles necesarios
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }
  
  // Si llega aquí, no tiene permisos
  return router.createUrlTree(['/unauthorized']);
};
