import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';
import {AccountsReceivableComponent} from "./accounts-receivable/accounts-receivable.component";
import {PricesComponent} from "./prices/prices.component";
import {ResolutionsComponent} from "./resolutions/resolutions.component";
import {SalesComponent} from "./sales/sales.component";
import { SalesElectronicComponent } from './sales-electronic/sales-electronic.component';
import {SalesOrdersComponent} from "./sales-orders/sales-orders.component";

const routes: Routes = [
  {
    path: 'prices',
    component: PricesComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Cotizaciones',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'sales-orders',
    component: SalesOrdersComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Ordenes de venta',
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
    path: 'sales-electronic',
    component: SalesElectronicComponent ,
    canActivate: [RoleGuard],
    data: {
      title: 'Ventas Electronicas',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'resolution',
    component: ResolutionsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Nº de resolución',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    },
  },
  {
    path: 'accounts-receivable',
    component: AccountsReceivableComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Cuentas por cobrar',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule {
}
