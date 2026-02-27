import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {
  BadgeModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ImgModule,
  ModalModule,
} from "@coreui/angular";

import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";

import {NgxBarcode6Module} from "ngx-barcode6";

import {ExpensesRoutingModule} from './expenses-routing.module';

import {CategoriesComponent} from './categories/categories.component';
import {LocationsComponent} from './locations/locations.component';
import {ProductsComponent} from './products/products.component';
import {PurchaseOrdersComponent} from './purchase-orders/purchase-orders.component';
import {PurchasesComponent} from './purchases/purchases.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {SharedModule} from "../shared/shared.module";
import { OutputsComponent } from './outputs/outputs.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    LocationsComponent,
    ProductsComponent,
    PurchaseOrdersComponent,
    PurchasesComponent,
    OutputsComponent
  ],
    imports: [
        CommonModule,
        ExpensesRoutingModule,
        GridModule,
        CardModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        BadgeModule,
        ModalModule,
        FormModule,
        ReactiveFormsModule,
        ToastModule,
        TableModule,
        TooltipModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ConfirmDialogModule,
        ImgModule,
        NgxBarcode6Module,
        AutoCompleteModule,
        FormsModule,
        SharedModule
    ],
  providers: [
    CurrencyPipe,
  ]
})
export class ExpensesModule {
}
