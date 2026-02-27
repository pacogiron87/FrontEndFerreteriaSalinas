import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {BadgeModule, ButtonModule, CardModule, FormModule, GridModule, ModalModule} from "@coreui/angular";

import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";

import {SystemRoutingModule} from './system-routing.module';

import {AgentsComponent} from './agents/agents.component';
import {BusinessComponent} from './business/business.component';
import {CashControlComponent} from './cash-control/cash-control.component';
import {CustomersComponent} from './customers/customers.component';
import {MainModule} from "../main/main.module";
import {ProvidersComponent} from './providers/providers.component';
import {UsersComponent} from './users/users.component';
import {SharedModule} from "../shared/shared.module";
import { TransactionsComponent } from './transactions/transactions.component';


@NgModule({
  declarations: [
    CashControlComponent,
    CustomersComponent,
    AgentsComponent,
    ProvidersComponent,
    UsersComponent,
    BusinessComponent,
    TransactionsComponent
  ],
  imports: [
    BadgeModule,
    ButtonModule,
    CardModule,
    CommonModule,
    FormModule,
    GridModule,
    InputTextModule,
    MainModule,
    ModalModule,
    ReactiveFormsModule,
    SystemRoutingModule,
    TableModule,
    ToastModule,
    TooltipModule,
    SharedModule,
  ]
})
export class SystemModule {
}
