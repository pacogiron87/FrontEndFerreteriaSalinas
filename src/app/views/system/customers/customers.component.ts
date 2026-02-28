import { Component, OnInit, signal, inject, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

// Shared Components
import { CustomerModalComponent } from "../../shared/customer-modal/customer-modal.component";

// Services
import { CustomerService } from "../services/customer.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Customer } from "../models/customer.model";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    RippleModule,
    CustomerModalComponent
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  // Services
  private readonly customerService = inject(CustomerService);
  public readonly utilitiesService = inject(UtilitiesService);

  // ViewChilds with Signals
  readonly customerModal = viewChild(CustomerModalComponent);

  // Data from Store (Signals)
  readonly allCustomers = toSignal(this.customerService.selectCustomers(), { initialValue: [] });
  readonly loading = toSignal(this.customerService.selectIsLoading(), { initialValue: true });

  constructor() {
    // Effect to handle real-time store updates
    effect(() => {
      const saved = toSignal(this.customerService.selectSavedCustomer())();
      if (saved) this.handleCustomerUpdate(saved);
    });
  }

  ngOnInit(): void {
    this.customerService.getCustomers();
  }

  saveChanges(customer: Customer): void {
    if (customer.id > 0) {
      this.customerService.updateCustomer(customer);
    } else {
      this.customerService.createCustomer(customer);
    }
  }

  changeStatus(customer: Customer, active: boolean): void {
    const updated = { ...customer, status: active };
    this.customerService.updateCustomer(updated);
  }

  private handleCustomerUpdate(customer: Customer): void {
    const list = [...this.allCustomers()];
    const index = list.findIndex(c => c.id === customer.id);

    if (index >= 0) {
      if (!customer.address) {
        // Simple status toggle
        list[index] = { ...list[index], status: !list[index].status };
      } else {
        // Full update
        list[index] = customer;
      }
    } else {
      // New record
      list.push(customer);
    }
    this.customerService.updateCustomers(list);
  }
}
