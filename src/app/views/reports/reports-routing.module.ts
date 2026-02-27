import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';
import {CustomersComponent} from "./customers/customers.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {PaymentsComponent} from "./payments/payments.component";
import {ProvidersComponent} from "./providers/providers.component";
import {PurchasesComponent} from "./purchases/purchases.component";
import {SalesComponent} from "./sales/sales.component";

const routes: Routes = [
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Inventario',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'purchases',
    component: PurchasesComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Compras',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Ventas',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Abonos',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'charges-to-collect',
    component: InventoryComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Cuentas por cobrar',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'debts-to-pay',
    component: InventoryComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Cuentas por pagar',
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
    path: 'providers',
    component: ProvidersComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Proveedores',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
