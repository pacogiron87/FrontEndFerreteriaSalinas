import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {
  BadgeModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  NavModule,
  TabsModule
} from "@coreui/angular";

import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";

import {ReportsRoutingModule} from './reports-routing.module';

import {InventoryComponent} from './inventory/inventory.component';
import {SalesComponent} from './sales/sales.component';
import {PaymentsComponent} from './payments/payments.component';
import {ChargesToCollectComponent} from './charges-to-collect/charges-to-collect.component';
import {DebtsToPayComponent} from './debts-to-pay/debts-to-pay.component';
import {CustomersComponent} from './customers/customers.component';
import {ProvidersComponent} from './providers/providers.component';
import { PurchasesComponent } from './purchases/purchases.component';
import {MultiSelectModule} from "primeng/multiselect";


@NgModule({
  declarations: [
    InventoryComponent,
    SalesComponent,
    PaymentsComponent,
    ChargesToCollectComponent,
    DebtsToPayComponent,
    CustomersComponent,
    ProvidersComponent,
    PurchasesComponent
  ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        ToastModule,
        GridModule,
        CardModule,
        NavModule,
        TabsModule,
        FormModule,
        ButtonModule,
        TooltipModule,
        CalendarModule,
        ReactiveFormsModule,
        TableModule,
        InputTextModule,
        BadgeModule,
        ModalModule,
        MultiSelectModule
    ],
  providers: [
    CurrencyPipe,
  ],
})
export class ReportsModule {
}
