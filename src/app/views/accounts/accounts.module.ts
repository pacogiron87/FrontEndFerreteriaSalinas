import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountsRoutingModule} from './accounts-routing.module';
import {ChargesToCollectComponent} from './charges-to-collect/charges-to-collect.component';
import {DebtsToPayComponent} from './debts-to-pay/debts-to-pay.component';


@NgModule({
  declarations: [
    ChargesToCollectComponent,
    DebtsToPayComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule {
}
