import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';

// Services
import { AccountReceivableService } from "../services/account-receivable.service";
import { CustomerService } from "src/app/views/system/services/customer.service";
import { LocationService } from "src/app/views/expenses/services/location.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Customer } from "src/app/views/system/models/customer.model";
import { Location } from "src/app/views/expenses/models/location.model";
import { Payment } from "../models/payment.model";
import { Sale } from "../models/sale.model";

@Component({
  selector: 'app-accounts-receivable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    AutoCompleteModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    BadgeModule,
    CardModule,
    RippleModule,
    TagModule
  ],
  providers: [CurrencyPipe],
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
})
export class AccountsReceivableComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountsReceivableService = inject(AccountReceivableService);
  private readonly customerService = inject(CustomerService);
  private readonly locationService = inject(LocationService);
  public readonly utilitiesService = inject(UtilitiesService);

  readonly isVisible = signal(false);
  readonly isSelectedCustomer = signal(false);
  readonly modalTitle = signal('Realizar abono');

  readonly pendingPayments = toSignal(this.accountsReceivableService.selectFoundPendingPayments(), { initialValue: [] });
  readonly loading = toSignal(this.accountsReceivableService.selectIsLoading(), { initialValue: false });
  readonly customers = toSignal(this.customerService.selectCustomers(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });

  customer = signal<Customer | null>(null);
  selectedSale = signal<Sale | null>(null);
  filteredCustomers = signal<Customer[]>([]);

  readonly totalPending = computed(() => this.pendingPayments().reduce((acc, s) => acc + (s.balance_payment || 0), 0));

  paymentForm!: FormGroup;

  private readonly savedPayment = toSignal(this.accountsReceivableService.selectPayment());

  constructor() {
    this.initForm();
    effect(() => {
      const payment = this.savedPayment();
      if (payment && this.isVisible()) {
        this.isVisible.set(false);
        this.refreshData();
      }
    });
  }

  ngOnInit(): void {
    this.customerService.getCustomers();
    this.locationService.getLocations();
    this.accountsReceivableService.searchPendingPayments(0);
  }

  private initForm(): void {
    this.paymentForm = this.fb.group({
      location: [null, Validators.required],
      payment: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  filterCustomer(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredCustomers.set(this.customers().filter(c => c.name.toLowerCase().includes(query) && c.status));
  }

  onSelectCustomer(event: AutoCompleteSelectEvent | Customer): void {
    const cust = 'value' in event ? (event.value as Customer) : event;
    this.customer.set(cust);
    this.isSelectedCustomer.set(true);
    this.accountsReceivableService.searchPendingPayments(cust.id);
  }

  onClearCustomer(): void {
    this.customer.set(null);
    this.isSelectedCustomer.set(false);
    this.accountsReceivableService.searchPendingPayments(0);
  }

  addPayment(sale: Sale | null = null): void {
    this.selectedSale.set(sale);
    this.modalTitle.set(sale ? 'Realizar abono a la venta' : 'Realizar abono al cliente');
    this.paymentForm.reset();
    this.isVisible.set(true);
  }

  processPayment(): void {
    if (this.paymentForm.valid) {
      const val = this.paymentForm.value;
      this.accountsReceivableService.addPayment({
        payment: val.payment, idLocation: val.location.id,
        idCustomer: this.selectedSale() ? 0 : this.customer()?.id || 0,
        idSale: this.selectedSale()?.id || 0,
      });
    }
  }

  private refreshData(): void {
    const id = this.isSelectedCustomer() ? this.customer()?.id || 0 : 0;
    this.accountsReceivableService.searchPendingPayments(id);
  }
}
