import { Component, OnInit, signal, computed, inject, viewChild, effect, ChangeDetectionStrategy } from '@angular/core';
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
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';

// Shared Components
import { ProductModalComponent } from "../../shared/product-modal/product-modal.component";

// Services
import { LocationService } from "../services/location.service";
import { ProductService } from "../services/product.service";
import { ProviderService } from "../../system/services/provider.service";
import { PurchaseService } from "../services/purchase.service";
import { UserService } from "../../system/services/user.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Product } from "../models/product.model";
import { Purchase } from "../models/purchase.model";
import { PurchaseDetail } from "../models/purchase-detail.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-purchases',
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
    ToastModule,
    BadgeModule,
    CardModule,
    RippleModule,
    TagModule,
    ProductModalComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly locationService = inject(LocationService);
  private readonly productService = inject(ProductService);
  private readonly providerService = inject(ProviderService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly userService = inject(UserService);
  public readonly utilitiesService = inject(UtilitiesService);

  readonly productModal = viewChild(ProductModalComponent);

  // Store Signals
  readonly purchases = toSignal(this.purchaseService.selectFoundPurchases(), { initialValue: [] });
  readonly products = toSignal(this.productService.selectProducts(), { initialValue: [] });
  readonly providers = toSignal(this.providerService.selectProviders(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly loading = toSignal(this.purchaseService.selectIsLoading(), { initialValue: false });
  readonly user = toSignal(this.userService.selectAuthenticateUser());

  // Reaction Signals (Fixed NG0602)
  private readonly addedPurchase = toSignal(this.purchaseService.selectAddedPurchase());
  private readonly savedProduct = toSignal(this.productService.selectSavedProduct());

  readonly isPurchaseActive = signal(false);
  readonly isSeeDetails = signal(false);
  readonly isSelectedProduct = signal(false);
  readonly productsToPurchase = signal<any[]>([]);

  filteredProducts = signal<Product[]>([]);

  readonly totalPurchase = computed(() => this.productsToPurchase().reduce((acc, p) => acc + (p.quantity * p.cost), 0));

  purchaseForm!: FormGroup;

  constructor() {
    this.initForm();

    // Correct Signals handling
    effect(() => {
      const p = this.addedPurchase();
      if (p) this.handleAddedPurchase(p);
    });

    effect(() => {
      const p = this.savedProduct();
      if (p) this.handleSavedProduct(p);
    });
  }

  ngOnInit(): void {
    this.locationService.getLocations();
    this.providerService.getProviders();
    this.productService.getProducts();
    this.purchaseService.searchPurchases({ customerName: null, startDate: null, endDate: null, categoriesId: null });
  }

  private initForm(): void {
    this.purchaseForm = this.fb.group({
      selectedProduct: [null, [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unitCost: [0, [Validators.required, Validators.min(0.01)]],
      location: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      selectedProductStock: [{ value: null, disabled: true }],
      selectedProductCost: [{ value: null, disabled: true }],
      comment: [null],
    });
  }

  newPurchase(): void { this.isPurchaseActive.set(true); }
  returnPurchasesList(): void { this.isPurchaseActive.set(false); this.purchaseForm.reset(); this.productsToPurchase.set([]); this.isSelectedProduct.set(false); }

  filterProduct(event: any): void {
    const query = event.query.toLowerCase();
    const ids = this.productsToPurchase().map(p => p.id);
    this.filteredProducts.set(this.products().filter(p => p.description.toLowerCase().includes(query) && !ids.includes(p.id)));
  }

  onSelectProduct(event: AutoCompleteSelectEvent | Product): void {
    const product = 'value' in event ? (event.value as Product) : event;
    this.isSelectedProduct.set(true);
    this.purchaseForm.patchValue({ selectedProductStock: product.stock, selectedProductCost: this.currencyPipe.transform(product.cost, 'USD'), unitCost: product.cost });
  }

  onClearProduct(): void {
    const cur = this.purchaseForm.value;
    this.purchaseForm.reset({ comment: cur.comment, provider: cur.provider, location: cur.location });
    this.isSelectedProduct.set(false);
  }

  saveNewProduct(product: Product): void { this.productService.createProduct(product); }

  addProductToPurchase(): void {
    const selected = this.purchaseForm.get('selectedProduct')?.value;
    const val = this.purchaseForm.value;
    this.productsToPurchase.update(list => [...list, { ...selected, cost: val.unitCost, quantity: val.quantity }]);
    this.onClearProduct();
  }

  removeProduct(product: any): void { this.productsToPurchase.update(list => list.filter(p => p.id !== product.id)); }

  completePurchase(): void {
    const date = this.utilitiesService.formatDate(new Date());
    const val = this.purchaseForm.value;
    const purchase: Purchase = {
      active: true, billing_date: date, code: 0, comment: val.comment, created_at: date, credit_note: 0,
      discount: 0, id: 0, invoice_format: '', invoice_number: 0, invoiced: date, location_id: val.location.id,
      order_date: date, other_tax: 0, provider_id: val.provider.id,
      purchaseDetailModels: this.productsToPurchase().map(p => ({ cost: p.cost, created_at: date, id: 0, item_id: p.id, purchase_id: 0, quantity: p.quantity, updated_at: date })),
      total: this.totalPurchase(), updated_at: date, user_id: this.user()?.id || '',
    };
    this.purchaseService.addPurchase(purchase);
    this.returnPurchasesList();
  }

  private handleAddedPurchase(p: Purchase): void {
    this.purchaseService.updatePurchases([...this.purchases(), p]);
    this.purchaseService.clearAddedPurchase();
  }

  private handleSavedProduct(p: Product): void {
    if (!this.products().find(x => x.id === p.id)) {
      this.productService.updateProducts([...this.products(), p]);
      this.onSelectProduct(p);
      this.purchaseForm.patchValue({ selectedProduct: p });
    }
    this.productService.clearSavedProduct();
  }
}
