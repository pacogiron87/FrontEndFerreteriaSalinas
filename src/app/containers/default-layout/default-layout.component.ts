import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService} from "../../core/services/auth.service";
import { NavigationService } from "../../core/services/navigation.service";
import { INavDataWithRoles } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems: INavDataWithRoles[] = [];
  private subscriptions: Subscription[] = [];
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}
  ngOnInit(): void {
    // Verificar autenticación
    this.subscriptions.push(
      this.authService.isAuthenticated$().subscribe(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      })
    );

    // Obtener menú filtrado por roles
    this.subscriptions.push(
      this.navigationService.filteredNavItems$.subscribe(items => {
        this.navItems = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
