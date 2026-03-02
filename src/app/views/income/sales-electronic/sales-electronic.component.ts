import { Component, OnInit, signal, computed, inject, viewChild, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

// PrimeNG 21 Standalone Components
import { ConfirmationService, SharedModule, MenuItem } from 'primeng/api';
import { TableModule, Table } from 'primeng/table';
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
import { SplitButtonModule } from 'primeng/splitbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Shared Components & Pipes
import { CustomerModalComponent } from "../../shared/customer-modal/customer-modal.component";
import { SearchSaleCustomerModalComponent } from "../../shared/search-sale-customer-modal/search-sale-customer-modal.component";
import { SafePipe } from "src/app/core/pipes/safe.pipe";

// Services
import { CustomerService } from "src/app/views/system/services/customer.service";
import { DocumentService } from "../services/document.service";
import { LocationService } from "src/app/views/expenses/services/location.service";
import { NotificationService } from "src/app/core/helpers/notification.service";
import { ProductService } from "src/app/views/expenses/services/product.service";
import { ResolutionService } from "../services/resolution.service";
import { SaleService } from "../services/sale.service";
import { UserService } from "src/app/views/system/services/user.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";
import { AuthService } from "src/app/core/services/auth.service";

// Repositories & Environments
import { InvoiceTypeDteRepository } from 'src/app/core/repositories/invoice-type.repository';
import { environment } from 'src/environments/environment';

// Models
import { Customer } from 'src/app/views/system/models/customer.model';
import { Document } from '../models/document.model';
import { Location } from 'src/app/views/expenses/models/location.model';
import { Product } from 'src/app/views/expenses/models/product.model';
import { Resolution } from '../models/resolution.model';
import { SaleDetail } from '../models/sale-detail.model';
import { Sale } from '../models/sale.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sales-electronic',
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
    SplitButtonModule,
    IconFieldModule,
    InputIconModule,
    SafePipe,
    CustomerModalComponent,
    SearchSaleCustomerModalComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './sales-electronic.component.html',
  styleUrls: ['./sales-electronic.component.scss']
})
export class SalesElectronicComponent implements OnInit {
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
  private readonly authService = inject(AuthService);

  readonly customerModal = viewChild(CustomerModalComponent);
  readonly searchSaleCustomerModal = viewChild(SearchSaleCustomerModalComponent);
  readonly dt = viewChild<Table>('dt');

  // Store Signals
  readonly sales = toSignal(this.saleService.selectSales(), { initialValue: [] });
  readonly customers = toSignal(this.customerService.selectCustomers(), { initialValue: [] });
  readonly products = toSignal(this.productService.selectProducts(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly resolutions = toSignal(this.resolutionService.selectResolutions().pipe(map(r => r.filter(x => x.status))), { initialValue: [] });
  readonly user = toSignal(this.userService.selectAuthenticateUser());
  readonly loading = toSignal(this.saleService.selectIsLoading(), { initialValue: false });
  readonly loadingDocument = toSignal(this.documentService.selectIsLoading(), { initialValue: false });

  // Reaction Signals (Moved outside effects to avoid NG0602)
  private readonly savedCustomer = toSignal(this.customerService.selectSavedCustomer());
  private readonly addedSale = toSignal(this.saleService.selectAddedSale());

  readonly isSaleActive = signal(false);
  readonly isSeeDetails = signal(false);
  readonly isRetry = signal(false);
  readonly isSelectDisabled = signal(false);
  readonly isModalErrorVisible = signal(false);
  readonly isViewerVisible = signal(false);
  readonly isDteViewerVisible = signal(false);
  readonly isCancelVisible = signal(false);
  readonly uniqueCustomer = signal(false);

  readonly invoiceType = signal(InvoiceTypeDteRepository[1].description);
  readonly productsToSale = signal<any[]>([]);
  readonly detainedTax = signal(false);
  readonly isMajorTaxpayerCustumer = signal(false);
  readonly isSelectedCustomer = signal(false);
  readonly isPendingPay = signal(false);

  readonly dteDetalle = signal<any>(null);
  readonly pdfUrl = signal('');
  readonly src = signal('');
  readonly maxQuantity = signal(0);
  readonly maxDiscount = signal(0);
  readonly maxDate = signal(this.calculateUTCMinus6());

  readonly invoiceTypes = InvoiceTypeDteRepository;
  readonly urlPdfBase = signal(environment.urlPdf);
  readonly urlPdfTkt = signal(environment.urlDteTkt);
  readonly urlPdfDteBase = signal(environment.urlPdfDte);

  readonly anonymousCustomer: Customer = {
    address: '', alias: '', businessName: '', commercialBusiness: '', country: 'El Salvador',
    createDate: '', createDateMigration: '', createdBy: '', departmentAddress: '', dui: '',
    email: '', id: 0, idCustomerMigration: false, isBusiness: false, isMigrated: false,
    isRetentionTax: false, mobile: '', modifiedBy: '', modifiedDate: '', municipality: '',
    name: 'Cliente anónimo', nit: '', nrc: '', phoneHome: '', phoneOffice: '', status: true,
  };

  saleForm!: FormGroup;
  invoiceForm!: FormGroup;

  filteredCustomers = signal<Customer[]>([]);
  filteredProducts = signal<Product[]>([]);
  filteredResolutions = signal<Resolution[]>([]);

  currentSale = signal<Sale | null>(null);
  temporalCustomer = signal<Customer | null>(null);
  currentDocument = signal<Document | null>(null);

  readonly totalSale = computed(() => {
    return parseFloat(this.productsToSale().reduce((acc, p) => !p.is_exempt_product ? acc + (p.quantity * (p.price - p.discount)) : acc, 0).toFixed(2));
  });

  readonly totalSaleExent = computed(() => {
    return parseFloat(this.productsToSale().reduce((acc, p) => p.is_exempt_product ? acc + (p.quantity * (p.price - p.discount)) : acc, 0).toFixed(2));
  });

  readonly totalTax = computed(() => {
    const taxable = this.productsToSale().reduce((acc, p) => !p.is_exempt_product ? acc + (p.quantity * (p.price - p.discount)) : acc, 0);
    return parseFloat((taxable - taxable / this.utilitiesService.getTaxWithInteger()).toFixed(2));
  });

  readonly grandTotal = computed(() => {
    return (this.totalSale() - this.detainedTaxAmount()) + this.totalSaleExent() + this.collectedTaxAmount();
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

  readonly collectedTaxAmount = computed(() => {
    if (!this.isMajorTaxpayerCustumer()) return 0;
    const taxable = this.productsToSale().reduce((acc, p) => {
      if (!p.is_exempt_product && !this.detainedTax()) {
        return acc + ((p.quantity * (p.price - p.discount)) / this.utilitiesService.getTaxWithInteger());
      }
      return acc;
    }, 0);
    return parseFloat((taxable - taxable / this.utilitiesService.getTaxCollectedInteger()).toFixed(2));
  });

  readonly canShowRow = computed(() => this.isSelectedCustomer() && !!this.saleForm?.get('location')?.value);

  constructor() {
    this.initForms();

    // Correct Signal reactions
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

  private calculateUTCMinus6(): Date {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    return new Date(utcNow.getTime() - 6 * 60 * 60000);
  }

  private initForms(): void {
    this.saleForm = this.fb.group({
      invoiceDate: [this.calculateUTCMinus6()],
      selectedCustomer: [null, [Validators.required]],
      location: [null, [Validators.required]],
      invoiceType: [null, Validators.required],
      selectedProduct: [null],
      quantity: [0],
      discount: [0],
      comment: [null],
      advance: [0],
      balance: [0],
    });
    this.invoiceForm = this.fb.group({
      controlNumber: [null, [Validators.required, Validators.pattern(/^DTE-\d{2}-[A-Za-z0-9]{8}-\d{15}$/)]],
    });
  }

  newSale(): void {
    this.isSaleActive.set(true);
    this.isRetry.set(false);
    this.productsToSale.set([]);
    this.saleForm.reset({ invoiceDate: this.calculateUTCMinus6() });
  }

  resend(sale: Sale): void {
    this.currentSale.set(sale);
    this.isSaleActive.set(true);
    this.isRetry.set(true);
    this.isSelectDisabled.set(true);
  }

  onSelectCustomer(event: AutoCompleteSelectEvent | Customer): void {
    const customer = 'value' in event ? (event.value as Customer) : event;
    this.detainedTax.set(customer.isRetentionTax || false);
    this.isMajorTaxpayerCustumer.set(customer.isMajorTaxpayer || false);
    this.isSelectedCustomer.set(true);
  }

  onClearCustomer(): void {
    this.detainedTax.set(false);
    this.isMajorTaxpayerCustumer.set(false);
    this.isSelectedCustomer.set(false);
    this.saleForm.get('selectedCustomer')?.setValue(null);
  }

  onSelectCustomerModal(customer: Customer): void {
    this.customerService.createCustomer(customer);
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

  onClearProduct(): void {
    this.saleForm.patchValue({ selectedProduct: null, quantity: 0, discount: 0 });
    this.maxQuantity.set(0);
  }

  removeProduct(product: any): void {
    this.productsToSale.update(list => list.filter(p => p.id !== product.id));
  }

  completeSale(): void {
    const sale = this.buildSale();
    const type = this.invoiceType().toLowerCase();
    if (type.includes('fiscal')) this.saleService.addSaleTaxCreditDte(sale);
    else this.saleService.addSaleInvoiceDte(sale);
    this.returnSalesList();
  }

  private buildSale(): Sale {
    const date = this.saleForm.get('invoiceDate')?.value;
    const customer = this.saleForm.get('selectedCustomer')?.value;
    const location = this.saleForm.get('location')?.value;
    return {
      active: true, advance_payment: 0, balance_payment: 0, comment: this.saleForm.get('comment')?.value,
      created_at: this.utilitiesService.formatDate(date), customer_id: customer.id,
      exception_sale: this.totalSaleExent(), id: 0, invoice_number: 0, invoice_status: 'Ingresada',
      invoice_total: this.grandTotal(), invoice_total_letters: this.utilitiesService.convertNumberToWords(this.grandTotal()),
      invoice_type: this.invoiceType(), is_invoice_detained: this.detainedTax(), is_pending: this.isPendingPay(),
      is_pending_pay: this.isPendingPay() ? 'Pendiente' : 'Pagado', location_id: location.id,
      saleDetails: this.productsToSale().map(p => ({
        affected_sale: !p.is_exempt_product ? this.utilitiesService.getCurrencyWithoutTax(p.price * p.quantity) : 0,
        exception_sale: p.is_exempt_product ? (p.price * p.quantity) : 0,
        created_at: this.utilitiesService.formatDate(date), description_item: p.description,
        discount: p.discount, id: 0, id_item: p.id, id_sale: 0, location: p.location_id, non_tax_sale: 0,
        quantity: p.quantity, unit_price: p.price - p.discount,
        unit_price_non_tax: this.utilitiesService.getCurrencyWithoutTax(p.price - p.discount),
        updated_at: this.utilitiesService.formatDate(date)
      })),
      sub_total_sale: this.totalSale(), tax_perceived: this.collectedTaxAmount(),
      tax_reteined: this.detainedTaxAmount(), tax_sale: this.totalTax(),
      total_sale: this.grandTotal(), updated_at: this.utilitiesService.formatDate(date),
      user_id: this.authService.currentUser!.id, is_retry: this.isRetry(),
      number_resolution_tax: null, tax_credit_sale: 0, tax_non_credit_sale: 0
    };
  }

  getSaleAffect(price: number, discount: number, quantity: number, product: any): number {
    if (product.is_exempt_product) return 0;
    return this.utilitiesService.getCurrencyWithoutTax((price - discount) * quantity);
  }

  getSaleExent(price: number, discount: number, quantity: number, product: any): number {
    if (!product.is_exempt_product) return 0;
    return (price - discount) * quantity;
  }

  loadSelectedSale(sale: Sale): void {
    const current = [...this.productsToSale()];
    sale.saleDetails.forEach(detail => {
      if (!current.some(p => detail.description_item === p.description)) {
        current.push({ id: detail.id_item, description: detail.description_item, price: detail.unit_price, quantity: detail.quantity, discount: detail.discount, is_exempt_product: false });
      }
    });
    this.productsToSale.set(current);
  }

  openDtePdf(sale: Sale): void { this.pdfUrl.set(`${this.urlPdfDteBase()}/${sale.code_generation_dte}.pdf`); this.isDteViewerVisible.set(true); }
  openTktDtePdf(sale: Sale): void { this.pdfUrl.set(`${this.urlPdfTkt()}/TKT${sale.code_generation_dte}.pdf`); this.isDteViewerVisible.set(true); }
  closeDteViewer(): void { this.isDteViewerVisible.set(false); this.pdfUrl.set(''); }
  downloadDteJson(sale: Sale): void { this.utilitiesService.downloadFile(this.urlPdfDteBase(), sale.code_generation_dte); }
  sendEmail(sale: Sale): void { this.saleService.addSendEmailDte({ idSale: sale.id, idCustomer: sale.customer_id, codeGeneration: sale.code_generation_dte }); }

  toggleErrorModal(sale?: Sale): void {
    if (!sale) { this.isModalErrorVisible.set(false); return; }
    const url = `${environment.urlDteLogs}${sale.control_number_dte}/${sale.control_number_dte}.recepcion.response.json`;
    this.http.get(url).subscribe(data => { this.dteDetalle.set(data); this.isModalErrorVisible.set(true); });
  }

  cancelSale(sale: Sale): void {
    this.currentDocument.set({ id_sale: sale.id, bill_number: sale.invoice_number.toString(), bill_type: sale.invoice_type, status: sale.invoice_status, is_canceled: false, control_number: sale.control_number_dte });
    this.isCancelVisible.set(true);
  }

  processCancel(): void {
    const doc = this.currentDocument();
    if (doc) {
      this.documentService.cancelDocumentDte({ idSale: doc.id_sale, controlNumber: this.invoiceForm.get('controlNumber')?.value, userId: this.authService.currentUser?.id });
      this.isCancelVisible.set(false);
      this.returnSalesList();
    }
  }

  getSaleActions(sale: Sale): MenuItem[] {
    const items: MenuItem[] = [];
    const isProcessed = ['Procesado por MH', 'Procesado en MH', 'Notificado por Email', 'Notificado', 'PROCESADO'].includes(sale.invoice_status.trim());
    const isInvalidated = sale.invoice_status.trim() === 'INVALIDADO';

    if (sale.control_number_dte && !isProcessed && !isInvalidated) {
      items.push({ label: 'Ver error', icon: 'pi pi-exclamation-triangle', command: () => this.toggleErrorModal(sale) });
    }
    if (isProcessed) {
      items.push({ label: 'Descargar JSON', icon: 'pi pi-file-edit', command: () => this.downloadDteJson(sale) });
      if (sale.invoice_type?.toLowerCase().includes('consumidor')) {
        items.push({ label: 'Imprimir Ticket', icon: 'pi pi-print', command: () => this.openTktDtePdf(sale) });
      }
      if (sale.code_generation_dte) {
        items.push({ label: 'Enviar por Email', icon: 'pi pi-envelope', command: () => this.sendEmail(sale) });
      }
    }
    if (!isInvalidated) {
      items.push({ label: 'Anular en MH', icon: 'pi pi-trash', command: () => this.cancelSale(sale) });
    }
    if (!isProcessed && !isInvalidated) {
      items.push({ label: 'Reintentar envío', icon: 'pi pi-refresh', command: () => this.resend(sale) });
    }
    return items;
  }

  primaryAction(sale: Sale): void {
    const isProcessed = ['Procesado por MH', 'Procesado en MH', 'Notificado por Email', 'Notificado', 'PROCESADO'].includes(sale.invoice_status.trim());
    if (isProcessed) {
      this.openDtePdf(sale);
    } else {
      this.toggleErrorModal(sale);
    }
  }

  returnSalesList(): void { this.isSaleActive.set(false); this.saleService.getAllSales(); }

  onFilterGlobal(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt()?.filterGlobal(value, 'contains');
  }

  onFilterStatus(value: string | null): void {
    this.dt()?.filter(value, 'invoice_status', 'contains');
  }
  filterCustomer(event: any): void { const q = event.query.toLowerCase(); this.filteredCustomers.set(this.customers().filter(c => c.name.toLowerCase().includes(q) && c.status)); }
  filterProduct(event: any): void { const q = event.query.toLowerCase(); this.filteredProducts.set(this.products().filter(p => p.description.toLowerCase().includes(q) && p.stock > 0)); }
  changeUniqueCustomer(event: any): void {
    this.uniqueCustomer.set(event.checked);
    if (this.uniqueCustomer()) { this.temporalCustomer.set(this.saleForm.get('selectedCustomer')?.value); this.saleForm.patchValue({ selectedCustomer: this.anonymousCustomer }); }
    else { this.saleForm.patchValue({ selectedCustomer: this.temporalCustomer() }); }
  }

  private handleCustomerUpdate(customer: Customer): void {
    const list = [...this.customers()];
    if (!list.find(c => c.id === customer.id)) { list.push(customer); this.customerService.updateCustomers(list); this.saleForm.patchValue({ selectedCustomer: customer }); }
    this.customerService.clearSavedCustomer();
  }

  private handleAddedSale(sale: Sale): void {
    const list = [...this.sales()];
    list.push(sale);
    this.saleService.updateSales(list);
    this.saleService.clearAddedSale();
  }
}
