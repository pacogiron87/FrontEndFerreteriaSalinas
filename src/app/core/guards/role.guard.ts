import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RoleType } from '../../views/system/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Primero verificar si el usuario está autenticado
    if (!this.authService.currentUser) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Obtener roles requeridos para la ruta
    const requiredRoles = route.data['roles'] as RoleType[];
    
    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Verificar si el usuario tiene al menos uno de los roles necesarios
    if (this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }
    
    // Si llega aquí, no tiene permisos
    this.router.navigate(['/unauthorized']);
    return false;
  }
}