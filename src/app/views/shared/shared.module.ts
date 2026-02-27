import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {BadgeModule, ButtonModule, FormModule, GridModule, ModalModule} from "@coreui/angular";

import {ButtonModule as ButtonModulePrime} from "primeng/button";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";

import {NgxBarcode6Module} from "ngx-barcode6";

import {CustomerModalComponent} from './customer-modal/customer-modal.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {ProductModalComponent} from './product-modal/product-modal.component';
import {SearchSaleCustomerModalComponent} from './search-sale-customer-modal/search-sale-customer-modal.component';

import {SafePipe} from "src/app/core/pipes/safe.pipe";
import {AutoCompleteModule} from "primeng/autocomplete";


@NgModule({
  declarations: [
    CustomerModalComponent,
    InvoiceComponent,
    ProductModalComponent,
    SafePipe,
    SearchSaleCustomerModalComponent,
  ],
  exports: [
    CustomerModalComponent,
    InvoiceComponent,
    ProductModalComponent,
    SafePipe,
    SearchSaleCustomerModalComponent,
  ],
  imports: [
    BadgeModule,
    ButtonModule,
    ButtonModulePrime,
    CommonModule,
    FormModule,
    GridModule,
    InputSwitchModule,
    InputTextModule,
    ModalModule,
    NgxBarcode6Module,
    ReactiveFormsModule,
    RippleModule,
    TableModule,
    TooltipModule,
    AutoCompleteModule
  ]
})
export class SharedModule {
}
