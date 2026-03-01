import { Component, inject, OnInit, signal, computed, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

// Services
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-default-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TooltipModule,
    RippleModule
  ],
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // User Signal from AuthService
  readonly user = toSignal(this.authService.currentUser$());

  // Sidebar visibility signal (managed via LayoutService in a real scenario)
  readonly sidebarVisible = signal(true);

  // Dark mode signal
  readonly isDarkMode = signal(false);

  readonly toggleSidebar = output<void>();

  // User menu items
  readonly userMenuItems: MenuItem[] = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => this.goToSettings()
    },
    { separator: true },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    // Implement profile navigation
  }

  goToSettings(): void {
    // Implement settings navigation
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(dark => !dark);
    document.documentElement.classList.toggle('app-dark');
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
