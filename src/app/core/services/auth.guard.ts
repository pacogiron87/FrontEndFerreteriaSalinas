import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { first, Observable, tap, of } from "rxjs";

import { UserService } from "src/app/views/system/services/user.service";
import { AuthRepository } from "src/app/views/auth/services/auth.repository";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private userService: UserService,
    private authRepository: AuthRepository
  ) {
  }

  canLoad(): Observable<boolean> {
    // Verificar si el token ha expirado
    if (this.authRepository.isTokenExpired()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.userService.isAuth().pipe(
      tap(status => {
        if (!status) {
          this.router.navigate(['/login']).then();
        }
      }),
      first()
    );
  }
}
