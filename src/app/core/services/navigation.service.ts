import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { navItems, INavDataWithRoles  as ImportedNavDataWithRoles } from '../../containers/default-layout/_nav';
import { AuthService} from './auth.service';
import { RoleType } from '../../views/system/models/user.model';
import { INavData } from '@coreui/angular';

// Ampliar la interfaz de navegación para incluir roles
export interface INavDataWithRoles extends INavData {
  roles?: RoleType[];
  children?: INavDataWithRoles[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private filteredNavItems = new BehaviorSubject<INavDataWithRoles[]>([]);

  constructor(private authService: AuthService) {
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

  private filterNavItemsByRole(items: INavDataWithRoles[]): INavDataWithRoles[] {
    // Filter each item in the navigation
    return items.filter(item => {
      // Always keep title items
      if (item.title) {
        return true;
      }
      
      // Check if user has required role for this item
      let hasRequiredRole = true;
      if (item.roles && item.roles.length > 0) {
        hasRequiredRole = this.authService.hasAnyRole(item.roles);
      }
      
      // Process children recursively
      if (item.children && item.children.length > 0) {
        // Filter children
        const filteredChildren = this.filterNavItemsByRole(item.children);

        // Replace children with filtered list
        item.children = filteredChildren;
        
        // If no children remain after filtering and parent doesn't have required role, hide parent
        if (filteredChildren.length === 0 && !hasRequiredRole) {
          return false;
        }

        // Keep parent with children even if parent doesn't have required role
        if (filteredChildren.length > 0) {
          return true;
        }
      }

      // Return true only if user has required role
      return hasRequiredRole;
    });
  }

  get filteredNavItems$(): Observable<INavDataWithRoles[]> {
    return this.filteredNavItems.asObservable();
  }
}
