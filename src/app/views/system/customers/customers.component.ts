import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Subscription} from "rxjs";

import {CustomerService} from "../services/customer.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Customer} from "../models/customer.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";

import {CustomerModalComponent} from "src/app/views/shared/customer-modal/customer-modal.component";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {
  @ViewChild(CustomerModalComponent) customerModal!: CustomerModalComponent;
  customers: Customer[] = [];
  loading = true;
  subscriptions: Subscription[] = [];
  statusTypeData = StatusTypeData;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    public utilitiesService: UtilitiesService,
  ) {
  }

  ngOnInit(): void {
    this.customerService.getCustomers();
    this.subscriptions[0] = this.customerService.selectCustomers().subscribe(customers => this.customers = customers);
    this.subscriptions[1] = this.customerService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[2] = this.customerService.selectSavedCustomer().subscribe(customer => this.updateCustomer(customer));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  changeStatus(customer: Customer, active: boolean): void {
    const customerToUpdate = {...customer};
    customerToUpdate.status = active;
    this.customerService.updateCustomer(customerToUpdate);
  }

  updateCustomer(customer: Customer): void {
    if (customer) {
      const index = this.customers.findIndex(c => c.id === customer.id);

      const customers = [...this.customers];
      if (index >= 0) {
        if (!customer.address) {
          customer = {...customers[index]};
          customer.status = !customer.status;
          customers[index] = customer;
          this.customerService.updateCustomers(customers);
        } else {
          customers[index] = customer;
          this.customerService.updateCustomers(customers);
        }

      } else {
        customers.push(customer);
        this.customerService.updateCustomers(customers);
      }
    }
  }

  saveChanges(customer: Customer): void {
    if (customer.id > 0) {
      this.customerService.updateCustomer(customer);
    } else {
      this.customerService.createCustomer(customer);
    }
  }

}
