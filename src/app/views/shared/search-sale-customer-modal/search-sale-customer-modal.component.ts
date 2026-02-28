import { Component, OnInit, signal, computed, inject, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';

// Services
import { SaleService } from "src/app/views/income/services/sale.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Customer } from "src/app/views/system/models/customer.model";
import { Sale } from "src/app/views/income/models/sale.model";

@Component({
  selector: 'app-search-sale-customer-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    RippleModule,
    BadgeModule
  ],
  templateUrl: './search-sale-customer-modal.component.html',
  styleUrls: ['./search-sale-customer-modal.component.scss']
})
export class SearchSaleCustomerModalComponent implements OnInit {
  // Services
  private readonly fb = inject(FormBuilder);
  private readonly saleService = inject(SaleService);
  public readonly utilitiesService = inject(UtilitiesService);

  // Outputs
  sendSale = output<Sale>();

  // Signals for state
  isVisible = model(false);
  customerId = signal(0);
  searchTerm = signal('');

  // Data from store
  loading = toSignal(this.saleService.selectIsLoading(), { initialValue: false });
  allSales = toSignal(this.saleService.selectSalesByCustomer(), { initialValue: [] });

  // Computed for filtering
  filteredSales = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const sales = this.allSales();
    
    if (!term) return sales;

    return sales.filter(sale => 
      sale.saleDetails.some(detail => 
        detail.description_item.toLowerCase().includes(term)
      ) || 
      sale.invoice_number.toString().includes(term)
    );
  });

  // Form
  saleForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    // Initial setup if needed
  }

  private initForm(): void {
    this.saleForm = this.fb.group({
      product: [''],
    });

    // Link form field to signal for reactive filtering
    this.saleForm.get('product')?.valueChanges.subscribe(val => {
      this.searchTerm.set(val || '');
    });
  }

  toggleModal(customer?: Customer): void {
    if (customer) {
      this.customerId.set(customer.id);
      this.saleService.searchSalesByCustomer(this.customerId());
      this.isVisible.set(true);
    } else {
      this.customerId.set(0);
      this.isVisible.set(false);
    }
  }

  selectSale(sale: Sale): void {
    this.sendSale.emit(sale);
    this.saleForm.reset();
    this.isVisible.set(false);
  }
}
