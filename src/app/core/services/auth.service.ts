import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, throwError, interval, Subscription } from 'rxjs';
import { catchError, tap, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User, RoleType } from '../../views/system/models/user.model';
import { AuthRepository } from '../../views/auth/services/auth.repository';
import { NotificationService } from '../../core/helpers/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenCheckSubscription: Subscription | null = null;
  private alive = true;

  constructor(
    private authRepository: AuthRepository,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loadUserFromStorage();
    this.setupTokenExpirationCheck();
  }

  // Cargar usuario desde localStorage al iniciar
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // Verificar si el token ha expirado
      if (this.authRepository.isTokenExpired()) {
        // Token expirado, realizar logout
        this.handleExpiredToken();
      } else {
        // Token válido, iniciar sesión
      const user = JSON.parse(storedUser) as User;
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }
  }

  // Configurar verificación periódica de expiración del token
  private setupTokenExpirationCheck(): void {
    // Verificar cada minuto si el token ha expirado
    this.tokenCheckSubscription = interval(60000) // 60000 ms = 1 minuto
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        // Solo verificar si el usuario está autenticado
        if (this.isAuthenticatedSubject.value) {
          if (this.authRepository.isTokenExpired()) {
            this.handleExpiredToken();
          }
        }
      });
  }

  // Manejar token expirado
  private handleExpiredToken(): void {
    // Limpiar datos de sesión
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Mostrar notificación
    this.notificationService.info('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');

    // Redirigir a login
    this.router.navigate(['/login']);
  }

  // Autenticar usuario
  authenticate(userName: string, password: string): void {
    this.authRepository.authenticate(userName, password)
      .pipe(
        tap(user => {
          // Guardar en localStorage y actualizar subjects
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);

          this.notificationService.success(`¡Bienvenido ${user.name}!`);
          this.router.navigate(['/income/sales-electronic']);
        }),
        catchError(error => {
          this.notificationService.error(error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated$(): Observable<boolean> {
    // Verificar token antes de devolver el estado de autenticación
    if (this.isAuthenticatedSubject.value && this.authRepository.isTokenExpired()) {
      this.handleExpiredToken();
  }
    return this.isAuthenticatedSubject.asObservable();
  }

  // Obtener el usuario actual
  currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Acceso directo al valor actual del usuario
  get currentUser(): User | null {
    // Verificar token antes de devolver el usuario
    if (this.currentUserSubject.value && this.authRepository.isTokenExpired()) {
      this.handleExpiredToken();
      return null;
    }
    return this.currentUserSubject.value;
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(roleType: RoleType): boolean {
    const user = this.currentUser;
    if (!user || !user.roles) return false;
    
    // Convert roles string to lowercase for case-insensitive comparison
    const userRole = user.roles.toLowerCase();
    // Convert the roleType enum value to lowercase
    const requiredRole = roleType.toLowerCase();

    // Check if the user's role matches the required role
    return userRole === requiredRole;
  }

  // Verificar si el usuario tiene al menos uno de los roles proporcionados
  hasAnyRole(roleTypes: RoleType[]): boolean {
    if (!roleTypes || roleTypes.length === 0) return true;
    return roleTypes.some(role => this.hasRole(role));
  }

  // Verificar el estado del token en cada petición API
  checkTokenBeforeRequest(): boolean {
    if (this.authRepository.isTokenExpired()) {
      this.handleExpiredToken();
      return false;
}
    return true;
  }

  // Limpiar recursos al destruir el servicio
  ngOnDestroy(): void {
    this.alive = false;
    if (this.tokenCheckSubscription) {
      this.tokenCheckSubscription.unsubscribe();
      this.tokenCheckSubscription = null;
    }
  }
}
