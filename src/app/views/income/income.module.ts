import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgModule} from '@angular/core';

import {
  BadgeModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  TableModule as TableModuleCoreUI
} from "@coreui/angular";

import {AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";

import {IncomeRoutingModule} from './income-routing.module';
import {PricesComponent} from './prices/prices.component';
import {ResolutionsComponent} from './resolutions/resolutions.component';
import {SalesComponent} from './sales/sales.component';
import { SalesElectronicComponent } from './sales-electronic/sales-electronic.component';
import {SalesOrdersComponent} from './sales-orders/sales-orders.component';
import {SharedModule} from "../shared/shared.module";
import {InputSwitchModule} from "primeng/inputswitch";
import { AccountsReceivableComponent } from './accounts-receivable/accounts-receivable.component';
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    PricesComponent,
    ResolutionsComponent,
    SalesComponent,
    SalesElectronicComponent,
    SalesOrdersComponent,
    AccountsReceivableComponent,
  ],
    imports: [
        AutoCompleteModule,
        BadgeModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CommonModule,
        ConfirmDialogModule,
        FormModule,
        FormsModule,
        GridModule,
        IncomeRoutingModule,
        InputTextModule,
        ModalModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        TableModuleCoreUI,
        ToastModule,
        TooltipModule,
        InputSwitchModule,
        RippleModule,
    ],
  providers: [
    CurrencyPipe,
  ]
})
export class IncomeModule {
}
