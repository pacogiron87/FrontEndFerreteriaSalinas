import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { navItems, AppMenuItem } from '../../containers/default-layout/_nav';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly authService = inject(AuthService);
  private readonly filteredNavItems = new BehaviorSubject<AppMenuItem[]>([]);

  constructor() {
    // Actualizar el menú cuando cambie el usuario
    this.authService.currentUser$().subscribe(user => {
      if (user) {
        this.updateNavigation();
      } else {
        this.filteredNavItems.next([]);
      }
    });
  }

  private updateNavigation(): void {
    const filtered = this.filterNavItemsByRole(navItems);
    this.filteredNavItems.next(filtered);
  }

  private filterNavItemsByRole(items: AppMenuItem[]): AppMenuItem[] {
    return items.filter(item => {
      // Keep separators
      if (item.separator) {
        return true;
      }
      
      // Check roles
      let hasRequiredRole = true;
      if (item.roles && item.roles.length > 0) {
        hasRequiredRole = this.authService.hasAnyRole(item.roles);
      }
      
      // Recursive filtering for sub-items
      if (item.items && item.items.length > 0) {
        const filteredChildren = this.filterNavItemsByRole(item.items);
        item.items = filteredChildren;
        
        if (filteredChildren.length === 0 && !hasRequiredRole) {
          return false;
        }
        return true;
      }

      return hasRequiredRole;
    });
  }

  get filteredNavItems$(): Observable<AppMenuItem[]> {
    return this.filteredNavItems.asObservable();
  }
}
