import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {AccountReceivableService} from "../services/account-receivable.service";
import {CustomerService} from "src/app/views/system/services/customer.service";
import {LocationService} from "src/app/views/expenses/services/location.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Customer} from "src/app/views/system/models/customer.model";
import {Location} from "src/app/views/expenses/models/location.model";
import {Payment} from "../models/payment.model";
import {Sale} from "../models/sale.model";


@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
})
export class AccountsReceivableComponent implements OnInit, OnDestroy {
  // @ts-ignore
  paymentForm: FormGroup;
  pendingPayments: Sale[] = [];
  customers: Customer[] = [];
  locations: Location[] = [];
  // @ts-ignore
  customer: Customer;
  // @ts-ignore
  filteredCustomers: Customer[];
  // @ts-ignore
  sale: Sale;
  loading = false;
  isSelectedCustomer = false;
  subscriptions: Subscription[] = [];
  modalTitle: string | undefined;
  isVisible = false;

  constructor(
    private accountsReceivableService: AccountReceivableService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private locationService: LocationService,
    public utilitiesService: UtilitiesService,
  ) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      location: [null, Validators.required],
      payment: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.accountsReceivableService.searchPendingPayments(0);
    this.customerService.getCustomers();
    this.locationService.getLocations();
    this.subscriptions[0] = this.accountsReceivableService.selectFoundPendingPayments().subscribe(pendingPayments => [...this.pendingPayments] = pendingPayments);
    this.subscriptions[1] = this.accountsReceivableService.selectIsLoading().subscribe(loading => this.loading = loading);
    this.subscriptions[2] = this.accountsReceivableService.selectPayment().subscribe(payment => this.afterPayment(payment));
    this.subscriptions[3] = this.customerService.selectCustomers().subscribe(customers => [...this.customers] = customers);
    this.subscriptions[4] = this.locationService.selectLocations().subscribe(locations => [...this.locations] = locations);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterCustomer(event: any): void {
    const query = event.query;

    this.filteredCustomers = query.trim().length > 0 ? this.customers.filter(c => c.name.trim().toLowerCase().includes(query.trim().toLowerCase()) && c.status) : [];
  }

  onSelectCustomer(): void {
    [...this.pendingPayments] = [];
    setTimeout(() => this.accountsReceivableService.searchPendingPayments(this.customer.id), 200);
    this.isSelectedCustomer = true;
  }

  onClearCustomer(): void {
    [...this.pendingPayments] = [];
    this.accountsReceivableService.searchPendingPayments(0);
    this.isSelectedCustomer = false;
    //this.pendingPaymentForm.patchValue({customer: null});
  }

  handleCancelChange(event: boolean): void {
    this.isVisible = event;
    if (!this.isVisible) {
      this.paymentForm.reset();
    }
  }

  toggleClose(): void {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      // @ts-ignore
      this.sale = null;
    }
  }

  addPayment(sale: Sale | null = null): void {
    if (sale === null) {
      // @ts-ignore
      this.sale = null;
      this.modalTitle = 'Realizar abono asociado al cliente';
    } else {
      this.modalTitle = 'Realizar abono asociado a la venta';
      this.sale = sale;
    }
    this.isVisible = true;
  }

  processPayment(): void {
    const payment: Payment = {
      payment: this.paymentForm.controls['payment'].value,
      idLocation: this.paymentForm.controls['location'].value.id,
      idCustomer: this.sale === null ? this.customer.id : 0,
      idSale: this.sale === null ? 0 : this.sale.id!,
    };

    this.accountsReceivableService.addPayment(payment);
  }

  afterPayment(payment: Payment): void {
    if (payment !== null && this.isVisible) {
      this.toggleClose();
      this.accountsReceivableService.searchPendingPayments(this.isSelectedCustomer ? this.customer.id : 0);
    }
  }

}
