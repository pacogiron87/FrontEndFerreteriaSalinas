import { Component, OnInit, signal, computed, inject, viewChild, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

// PrimeNG 21 Standalone Components
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';

// Shared Components & Pipes
import { CustomerModalComponent } from "../../shared/customer-modal/customer-modal.component";
import { SearchSaleCustomerModalComponent } from "../../shared/search-sale-customer-modal/search-sale-customer-modal.component";
import { SafePipe } from "src/app/core/pipes/safe.pipe";

// Services
import { CustomerService } from "../../system/services/customer.service";
import { DocumentService } from "../services/document.service";
import { LocationService } from "../../expenses/services/location.service";
import { NotificationService } from "src/app/core/helpers/notification.service";
import { ProductService } from "../../expenses/services/product.service";
import { ResolutionService } from "../services/resolution.service";
import { SaleService } from "../services/sale.service";
import { UserService } from "../../system/services/user.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Repositories & Environments
import { InvoiceTypeRepository } from "src/app/core/repositories/invoice-type.repository";
import { environment } from "src/environments/environment";

// Models
import { Customer } from "../../system/models/customer.model";
import { Document } from "../models/document.model";
import { Location } from "../../expenses/models/location.model";
import { Product } from "../../expenses/models/product.model";
import { Resolution } from "../models/resolution.model";
import { SaleDetail } from "../models/sale-detail.model";
import { Sale } from "../models/sale.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sales',
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
    TooltipModule,
    ToggleSwitchModule,
    DatePickerModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    BadgeModule,
    RippleModule,
    TagModule,
    SafePipe,
    CustomerModalComponent,
    SearchSaleCustomerModalComponent
  ],
  providers: [CurrencyPipe, DecimalPipe],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly customerService = inject(CustomerService);
  private readonly documentService = inject(DocumentService);
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly locationService = inject(LocationService);
  private readonly notificationService = inject(NotificationService);
  private readonly productService = inject(ProductService);
  private readonly resolutionService = inject(ResolutionService);
  private readonly saleService = inject(SaleService);
  private readonly userService = inject(UserService);
  public readonly utilitiesService = inject(UtilitiesService);

  readonly customerModal = viewChild(CustomerModalComponent);
  readonly searchSaleCustomerModal = viewChild(SearchSaleCustomerModalComponent);

  // Store Signals
  readonly sales = toSignal(this.saleService.selectSales(), { initialValue: [] });
  readonly customers = toSignal(this.customerService.selectCustomers(), { initialValue: [] });
  readonly products = toSignal(this.productService.selectProducts(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly resolutions = toSignal(this.resolutionService.selectResolutions().pipe(map(r => r.filter(x => x.status))), { initialValue: [] });
  readonly user = toSignal(this.userService.selectAuthenticateUser());
  readonly loading = toSignal(this.saleService.selectIsLoading(), { initialValue: false });

  // Reaction Signals (Fixed NG0602)
  private readonly savedCustomer = toSignal(this.customerService.selectSavedCustomer());
  private readonly addedSale = toSignal(this.saleService.selectAddedSale());

  readonly isSaleActive = signal(false);
  readonly isSeeDetails = signal(false);
  readonly isViewerVisible = signal(false);
  readonly invoiceType = signal(InvoiceTypeRepository[0].description);
  readonly productsToSale = signal<any[]>([]);
  readonly detainedTax = signal(false);
  readonly isSelectedCustomer = signal(false);
  readonly isPendingPay = signal(false);
  
  readonly maxQuantity = signal(0);
  readonly maxDiscount = signal(0);
  readonly minDate = signal(new Date());
  readonly urlPdfBase = signal(environment.urlPdf);
  readonly src = signal('');

  readonly invoiceTypes = InvoiceTypeRepository;
  readonly anonymousCustomer: Customer = {
    address: "", alias: "", businessName: "", commercialBusiness: "", country: "El Salvador",
    createDate: "", createDateMigration: "", createdBy: "", departmentAddress: "", dui: "",
    email: "", id: 0, idCustomerMigration: false, isBusiness: false, isMigrated: false,
    isRetentionTax: false, mobile: "", modifiedBy: "", modifiedDate: "", municipality: "",
    name: "Cliente anónimo", nit: "", nrc: "", phoneHome: "", phoneOffice: "", status: true,
  };

  saleForm!: FormGroup;
  filteredCustomers = signal<Customer[]>([]);
  filteredProducts = signal<Product[]>([]);
  temporalCustomer = signal<Customer | null>(null);

  readonly totalSale = computed(() => {
    return parseFloat(this.productsToSale().reduce((acc, p) => acc + (p.quantity * (p.price - p.discount)), 0).toFixed(2));
  });

  readonly detainedTaxAmount = computed(() => {
    if (this.totalSale() >= environment.taxes.minimumWithHoldingValue) {
      const customer = this.saleForm?.get('selectedCustomer')?.value;
      if (customer?.isRetentionTax) {
        return parseFloat(((this.totalSale() / this.utilitiesService.getTaxWithInteger()) * this.utilitiesService.getTaxWithHeld()).toFixed(2));
      }
    }
    return 0;
  });

  constructor() {
    this.initForms();
    
    // Correct Reactions
    effect(() => {
      const customer = this.savedCustomer();
      if (customer) this.handleCustomerUpdate(customer);
    });
    
    effect(() => {
      const sale = this.addedSale();
      if (sale) this.handleAddedSale(sale);
    });
  }

  ngOnInit(): void {
    this.customerService.getCustomers();
    this.locationService.getLocations();
    this.productService.getProducts();
    this.resolutionService.getAllResolutions();
    this.saleService.getAllSales();
  }

  private initForms(): void {
    this.saleForm = this.fb.group({
      selectedCustomer: [null, [Validators.required]],
      location: [null, [Validators.required]],
      selectedProduct: [null],
      quantity: [0],
      discount: [0],
      comment: [null],
      advance: [0],
      balance: [0],
    });
  }

  newSale(): void { this.isSaleActive.set(true); this.productsToSale.set([]); this.saleForm.reset(); }
  returnSalesList(): void { this.isSaleActive.set(false); this.saleService.getAllSales(); }

  filterCustomer(event: any): void {
    const q = event.query.toLowerCase();
    this.filteredCustomers.set(this.customers().filter(c => c.name.toLowerCase().includes(q) && c.status));
  }

  filterProduct(event: any): void {
    const q = event.query.toLowerCase();
    this.filteredProducts.set(this.products().filter(p => p.description.toLowerCase().includes(q) && p.stock > 0));
  }

  onSelectCustomer(event: AutoCompleteSelectEvent | Customer): void {
    const customer = 'value' in event ? (event.value as Customer) : event;
    this.detainedTax.set(customer.isRetentionTax || false);
    this.isSelectedCustomer.set(true);
  }

  onSelectProduct(event: AutoCompleteSelectEvent | Product): void {
    const product = 'value' in event ? (event.value as Product) : event;
    this.maxQuantity.set(product.stock);
    this.maxDiscount.set(product.sale_price - 0.01);
  }

  addProductToSale(): void {
    const selected = this.saleForm.get('selectedProduct')?.value;
    if (!selected) return;
    this.productsToSale.update(list => [...list, { ...selected, price: selected.sale_price, quantity: this.saleForm.get('quantity')?.value, discount: this.saleForm.get('discount')?.value || 0 }]);
    this.onClearProduct();
  }

  onClearProduct(): void { this.saleForm.patchValue({ selectedProduct: null, quantity: 0, discount: 0 }); this.maxQuantity.set(0); }
  removeProduct(product: any): void { this.productsToSale.update(list => list.filter(p => p.id !== product.id)); }

  completeSale(): void {
    const sale = this.buildSale();
    this.saleService.addSale(sale);
    this.returnSalesList();
  }

  private buildSale(): Sale {
    const customer = this.saleForm.get('selectedCustomer')?.value;
    const location = this.saleForm.get('location')?.value;
    const date = this.utilitiesService.formatDate(new Date());
    return {
      active: true, advance_payment: 0, balance_payment: 0, comment: this.saleForm.get('comment')?.value,
      created_at: date, customer_id: customer.id, exception_sale: 0, id: 0, invoice_number: 0,
      invoice_status: 'Ingresada', invoice_total: this.totalSale() - this.detainedTaxAmount(),
      invoice_total_letters: this.utilitiesService.convertNumberToWords(this.totalSale() - this.detainedTaxAmount()),
      invoice_type: this.invoiceType(), is_invoice_detained: this.detainedTax(), is_pending: false,
      is_pending_pay: 'Pagado', location_id: location.id,
      saleDetails: this.productsToSale().map(p => ({
        affected_sale: (p.price - p.discount) * p.quantity, created_at: date, description_item: p.description,
        discount: p.discount, exception_sale: 0, id: 0, id_item: p.id, id_sale: 0, location: p.location_id,
        non_tax_sale: 0, quantity: p.quantity, unit_price: p.price - p.discount,
        unit_price_non_tax: this.utilitiesService.getCurrencyWithoutTax(p.price - p.discount), updated_at: date
      })),
      sub_total_sale: this.totalSale(), tax_perceived: 0, tax_reteined: this.detainedTaxAmount(),
      tax_sale: 0, total_sale: this.totalSale() - this.detainedTaxAmount(),
      updated_at: date, user_id: this.user()?.id || "", is_retry: false,
      number_resolution_tax: null, tax_credit_sale: 0, tax_non_credit_sale: 0
    };
  }

  toggleViewer(sale: Sale): void { this.src.set(`${this.urlPdfBase()}/CF${sale.id}.pdf`); this.isViewerVisible.set(true); }
  cancelSale(sale: Sale): void { this.confirmationService.confirm({ header: 'Confirmación', message: '¿Está seguro de anular esta venta?', accept: () => {} }); }
  saveNewCustomer(customer: Customer): void { this.customerService.createCustomer(customer); }
  loadSelectedSale(sale: Sale): void { /* Load logic */ }
  getBalance(): void { /* Balance logic */ }

  private handleCustomerUpdate(customer: Customer): void {
    const list = [...this.customers()];
    if (!list.find(c => c.id === customer.id)) {
      list.push(customer);
      this.customerService.updateCustomers(list);
      this.saleForm.patchValue({ selectedCustomer: customer });
    }
  }

  private handleAddedSale(sale: Sale): void {
    const list = [...this.sales()];
    list.push(sale);
    this.saleService.updateSales(list);
  }
}
