import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers/default-layout';
import { LoginComponent } from './views/auth/login/login.component';
import { UnauthorizedComponent } from './views/auth/unauthorized/unauthorized.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { RoleType } from './views/system/models/user.model';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'income/sales-electronic',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'main',
        loadChildren: () => import('./views/main/main.module').then(m => m.MainModule)
      },
      {
        path: 'dteinvoices',
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadChildren: () => import('./views/income/income.module').then(m => m.IncomeModule)
      },
      {
        path: 'expenses',
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadChildren: () => import('./views/expenses/expenses.module').then(m => m.ExpensesModule)
      },
      {
        path: 'income',
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadChildren: () => import('./views/income/income.module').then(m => m.IncomeModule)
      },
      {
        path: 'system',
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadChildren: () => import('./views/system/system.module').then(m => m.SystemModule)
      },
      {
        path: 'reports',
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN, RoleType.MEMBER] },
        loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
