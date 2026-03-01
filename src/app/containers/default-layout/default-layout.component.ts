import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';

// Custom Components
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { DefaultFooterComponent } from './default-footer/default-footer.component';

// Services
import { AuthService } from "../../core/services/auth.service";
import { NavigationService } from "../../core/services/navigation.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DrawerModule,
    PanelMenuModule,
    ButtonModule,
    AvatarModule,
    RippleModule,
    ScrollPanelModule,
    TooltipModule,
    ProgressBarModule,
    DefaultHeaderComponent,
    DefaultFooterComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);

  readonly sidebarVisible = signal(true);
  readonly sidebarCollapsed = signal(false);
  readonly isMobile = signal(false);

  readonly navItems = toSignal(this.navigationService.filteredNavItems$, { initialValue: [] });
  readonly user = toSignal(this.authService.currentUser$());
  readonly isAuthenticated = toSignal(this.authService.isAuthenticated$(), { initialValue: true });

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 992);
    if (this.isMobile()) {
      this.sidebarVisible.set(false);
    } else {
      this.sidebarVisible.set(true);
    }
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.sidebarVisible.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }
}
