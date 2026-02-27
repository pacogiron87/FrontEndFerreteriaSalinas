import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';

import {AgentsComponent} from "./agents/agents.component";
import {BusinessComponent} from "./business/business.component";
import {CustomersComponent} from "./customers/customers.component";
import {ProvidersComponent} from "./providers/providers.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {UsersComponent} from "./users/users.component";

const routes: Routes = [
/*  {
    path: 'cash-control',
    component: CashControlComponent,
    data: {
      title: 'Control de efectivo'
    }
  },*/
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Control de efectivo',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Clientes',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'agents',
    component: AgentsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Agentes',
      roles: [RoleType.ADMIN, RoleType.MEMBER]
    }
  },
  {
    path: 'providers',
    component: ProvidersComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Proveedores',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Usuarios',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'business',
    component: BusinessComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Empresa',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {
}

