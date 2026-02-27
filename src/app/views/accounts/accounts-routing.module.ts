import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChargesToCollectComponent} from "./charges-to-collect/charges-to-collect.component";
import {DebtsToPayComponent} from "./debts-to-pay/debts-to-pay.component";
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';

const routes: Routes = [
  {
    path: 'charges-to-collect',
    component: ChargesToCollectComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Cuentas por cobrar',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
  {
    path: 'debts-to-pay',
    component: DebtsToPayComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Cuentas por pagar',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
