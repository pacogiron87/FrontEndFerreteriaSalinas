import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { RoleType } from './views/system/models/user.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'income/sales-electronic',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./containers/default-layout/default-layout.component').then(m => m.DefaultLayoutComponent),
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.currentUser) return true;
      return router.createUrlTree(['/login']);
    }],
    children: [
      {
        path: 'income/sales-electronic',
        canActivate: [(route: any) => {
          const auth = inject(AuthService);
          const router = inject(Router);
          const roles = route.data?.['roles'] as RoleType[];
          if (!auth.currentUser) return router.createUrlTree(['/login']);
          if (!roles || roles.length === 0 || auth.hasAnyRole(roles)) return true;
          return router.createUrlTree(['/unauthorized']);
        }],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/income/sales-electronic/sales-electronic.component').then(m => m.SalesElectronicComponent)
      },
      {
        path: 'expenses/products',
        canActivate: [(route: any) => {
          const auth = inject(AuthService);
          const router = inject(Router);
          const roles = route.data?.['roles'] as RoleType[];
          if (!auth.currentUser) return router.createUrlTree(['/login']);
          if (!roles || roles.length === 0 || auth.hasAnyRole(roles)) return true;
          return router.createUrlTree(['/unauthorized']);
        }],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/expenses/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'expenses/categories',
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/expenses/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'expenses/locations',
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/expenses/locations/locations.component').then(m => m.LocationsComponent)
      },
      {
        path: 'system/customers',
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/system/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'system/providers',
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/system/providers/providers.component').then(m => m.ProvidersComponent)
      },
      {
        path: 'system/users',
        data: { roles: [RoleType.ADMIN] },
        loadComponent: () => import('./views/system/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'income/resolutions',
        data: { roles: [RoleType.ADMIN] },
        loadComponent: () => import('./views/income/resolutions/resolutions.component').then(m => m.ResolutionsComponent)
      },
      {
        path: 'reports/sales',
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadComponent: () => import('./views/reports/sales/sales.component').then(m => m.SalesReportComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./views/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { path: '**', redirectTo: 'income/sales-electronic' }
];
