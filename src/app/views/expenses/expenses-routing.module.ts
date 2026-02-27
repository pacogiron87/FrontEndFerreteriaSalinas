import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';
import {CategoriesComponent} from "./categories/categories.component";
import {LocationsComponent} from "./locations/locations.component";
import {OutputsComponent} from "./outputs/outputs.component";
import {ProductsComponent} from "./products/products.component";
import {PurchaseOrdersComponent} from "./purchase-orders/purchase-orders.component";
import {PurchasesComponent} from "./purchases/purchases.component";

const routes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Categorias',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Localidades',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Productos',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'purchase-orders',
    component: PurchaseOrdersComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Ordenes de compra',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'outputs',
    component: OutputsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Salidas',
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {
}
