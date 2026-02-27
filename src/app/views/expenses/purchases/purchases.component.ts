import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {ProductModalComponent} from "src/app/views/shared/product-modal/product-modal.component";

import {LocationService} from "../services/location.service";
import {NotificationService} from "src/app/core/helpers/notification.service";
import {ProductService} from "../services/product.service";
import {ProviderService} from "src/app/views/system/services/provider.service";
import {PurchaseService} from "../services/purchase.service";
import {UserService} from "src/app/views/system/services/user.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {InvoiceType} from "src/app/core/enums/invoice-type.enum";
import {Location} from "../models/location.model";
import {Product} from "../models/product.model";
import {Provider} from "src/app/views/system/models/provider.model";
import {PurchaseDetail} from "../models/purchase-detail.model";
import {Purchase} from "../models/purchase.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";
import {User} from "src/app/views/system/models/user.model";


@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit, OnDestroy {
  @ViewChild(ProductModalComponent) productModal!: ProductModalComponent;
  // @ts-ignore
  purchaseForm: FormGroup;
  purchases: Purchase[] = [];
  purchaseId = 0;
  loading = false;
  isModalVisible = false;
  isPurchaseActive = false;
  isSeeDetails = false;
  modalTitle: string | undefined;
  subscriptions: Subscription[] = [];
  // @ts-ignore
  filteredProducts: Product[];
  products: Product[] = [];
  // @ts-ignore
  user: User;
  productsToPurchase: any[] = [];
  invoiceType: InvoiceType = InvoiceType.DELIVERY_NOTE;
  invoiceTypes = InvoiceType;
  isSelectedProduct = false;
  statusTypeData = StatusTypeData;
  locations: Location[] = [];
  providers: Provider[] = [];
  searchInformation = {
    customerName: null,
    startDate: null,
    endDate: null,
    categoriesId: null,
  };

  constructor(
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private productService: ProductService,
    private providerService: ProviderService,
    private purchaseService: PurchaseService,
    private userService: UserService,
    public utilitiesService: UtilitiesService,
  ) {
  }

  ngOnInit(): void {
    this.purchaseForm = this.fb.group({
      selectedProduct: [null, [Validators.required]],
      quantity: [0, [Validators.required]],
      unitCost: [0, [Validators.required]],
      location: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      selectedProductStock: [null],
      selectedProductCost: [null],
      comment: [null],
    });

    this.locationService.getLocations();
    this.providerService.getProviders();
    this.productService.getProducts();
    this.purchaseService.searchPurchases(this.searchInformation);
    this.subscriptions[0] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
    this.subscriptions[1] = this.productService.selectProducts().subscribe(products => [...this.products] = products);
    this.subscriptions[2] = this.productService.selectSavedProduct().subscribe(product => this.updateProduct(product));
    this.subscriptions[3] = this.providerService.selectProviders().subscribe(providers => this.providers = providers);
    this.subscriptions[4] = this.purchaseService.selectAddedPurchase().subscribe(purchase => this.updatePurchasesList(purchase));
    this.subscriptions[5] = this.purchaseService.selectFoundPurchases().subscribe(purchases => [...this.purchases] = purchases);
    this.subscriptions[6] = this.purchaseService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[7] = this.userService.selectAuthenticateUser().subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  newPurchase(): void {
    this.isPurchaseActive = true;
  }

  seeDetails(): void {
    this.isSeeDetails = true;
  }

  saveNewProduct(product: Product): void {
    this.productService.createProduct(product);
  }

  returnPurchasesList(): void {
    this.isPurchaseActive = false;
    this.isSeeDetails = false;
    this.purchaseForm.reset();
    this.invoiceType = InvoiceType.DELIVERY_NOTE;
    this.productsToPurchase = [];
    this.isSelectedProduct = false;
  }

  filterProduct(event: any): void {
    let index = 0;
    const query = event.query;

    if (query.trim().length > 0) {
      const previousFilter = this.products.filter(p => p.description.trim().toLowerCase().includes(query.trim().toLowerCase()) && p.stock > 0);
      this.productsToPurchase.forEach(product => {
        index = previousFilter.findIndex(p => p.id === product.id);
        if (index !== -1) {
          previousFilter.splice(index, 1);
        }
      });

      this.filteredProducts = previousFilter;
    } else {
      this.filteredProducts = [];
    }
  }

  onSelectProduct(product: Product): void {
    this.isSelectedProduct = true;
    this.purchaseForm.patchValue({
      selectedProductStock: product.stock,
      selectedProductCost: this.currencyPipe.transform(product.cost, 'USD'),
    });
  }

  onClearProduct(): void {
    const comment = this.purchaseForm.controls['comment'].value;
    const provider = this.purchaseForm.controls['provider'].value;
    const location = this.purchaseForm.controls['location'].value;
    this.purchaseForm.reset();
    this.purchaseForm.patchValue({
      comment: comment,
      provider: provider,
      location: location,
    });
    this.isSelectedProduct = false;
  }

  isProductValidToAdd(): boolean {
    const selectedProduct = this.purchaseForm.controls['selectedProduct'].value;
    const quantity = this.purchaseForm.controls['quantity'].value;
    const unitCost = this.purchaseForm.controls['unitCost'].value;

    if (selectedProduct === null) {
      return false;
    }

    return quantity > 0 && unitCost > 0;
  }

  addProductToPurchase(): void {
    const selectedProduct = this.purchaseForm.controls['selectedProduct'].value;
    const product = {
      id: selectedProduct.id,
      brand_code: selectedProduct.brand_code,
      company_code: selectedProduct.company_code,
      distributor_code: selectedProduct.company_code,
      internal_code: selectedProduct.internal_code,
      barcode: selectedProduct.barcode,
      description: selectedProduct.description,
      stock: selectedProduct.stock,
      minimum_stock: selectedProduct.minimum_stock,
      reservation: selectedProduct.reservation,
      cost: this.purchaseForm.controls['unitCost'].value,
      price: selectedProduct.sale_price,
      wholesale_price: selectedProduct.wholesale_price,
      quantity: this.purchaseForm.controls['quantity'].value,
      category_id: selectedProduct.category_id,
      provider_id: selectedProduct.provider_id,
      location_id: selectedProduct.location_id,
      valid_quantity: this.purchaseForm.controls['quantity'].value,
      valid_cost: this.purchaseForm.controls['unitCost'].value,
    }

    this.productsToPurchase.push(product);
    this.productsToPurchase = [...this.productsToPurchase];
    this.notificationService.info('¡Se agregó el producto correctamente!');
    this.onClearProduct();
  }

  getTotalPurchase(): number {
    let total = 0;
    this.productsToPurchase.forEach(product => total = total + (product.quantity * product.cost));
    return parseFloat(total.toFixed(2));
  }

  getTotalTax(): number {
    let total = 0;
    this.productsToPurchase.forEach(product => total = total + (product.quantity * this.utilitiesService.getCurrencyTax(product.price - product.discount)));
    return parseFloat(total.toFixed(2));
  }

  getSubTotalPurchase(): number {
    const total = this.getTotalPurchase() - this.getTotalTax();
    return parseFloat(total.toFixed(2));
  }

  getTotalCost(): string {
    const quantity = this.purchaseForm.controls['quantity'].value;
    const unitCost = this.purchaseForm.controls['unitCost'].value;

    if (!isNaN(quantity) && !isNaN(unitCost)) {
      // @ts-ignore
      return this.currencyPipe.transform((quantity * unitCost).toFixed(2), 'USD')
    }

    return '$0.0';
  }

  removeProduct(product: any): void {
    this.productsToPurchase = this.productsToPurchase.filter(p => p.id !== product.id);
    this.notificationService.info('¡Se eliminó el producto correctamente!');
  }

  isValidToPurchase(): boolean {
    return this.productsToPurchase.length > 0 && this.purchaseForm.controls['provider'].value != null && this.purchaseForm.controls['location'].value != null;
  }

  onEditQuantity(product: any): void {
    if (product.quantity <= 0) {
      product.quantity = product.valid_quantity;
      this.notificationService.warning('¡La cantidad no puede ser menor a uno!');
      return;
    }

    product.valid_quantity = product.quantity;
    this.notificationService.info('¡Se editó la cantidad correctamente!');
  }

  onEditCost(product: any): void {
    if (product.cost < 0.01) {
      product.cost = product.valid_cost;
      this.notificationService.warning('¡El costo no puede ser menor o igual a cero!');
      return;
    }

    product.valid_cost = product.cost;
    this.notificationService.info('¡Se editó el costo correctamente!');
  }

  completePurchase(): void {
    this.purchaseService.addPurchase(this.buildPurchase());
    this.returnPurchasesList();
  }

  updatePurchasesList(purchase: Purchase): void {
    if (purchase) {
      const purchases = [...this.purchases];
      purchases.push(purchase);
      this.purchaseService.updatePurchases(purchases);
    }
  }

  buildPurchase(): Purchase {
    const date = new Date();
    const purchaseDetails: PurchaseDetail[] = [];
    const provider = this.purchaseForm.controls['provider'].value;
    const location = this.purchaseForm.controls['location'].value;

    this.productsToPurchase.forEach(product =>
      purchaseDetails.push({
          cost: product.cost,
          created_at: this.utilitiesService.formatDate(date),
          id: 0,
          item_id: product.id,
          purchase_id: 0,
          quantity: product.quantity,
          updated_at: this.utilitiesService.formatDate(date),
        }
      )
    );

    return {
      active: true,
      billing_date: this.utilitiesService.formatDate(date),
      code: 0,
      comment: this.purchaseForm.controls['comment'].value,
      created_at: this.utilitiesService.formatDate(date),
      credit_note: 0,
      discount: 0,
      id: 0,
      invoice_format: '',
      invoice_number: 0,
      invoiced: this.utilitiesService.formatDate(date),
      location_id: location.id,
      order_date: this.utilitiesService.formatDate(date),
      other_tax: 0,
      provider_id: provider.id,
      purchaseDetailModels: purchaseDetails,
      total: this.getTotalPurchase(),
      updated_at: this.utilitiesService.formatDate(date),
      user_id: this.user.id,
    };
  }

  updateProduct(product: Product): void {
    if (product) {
      const index = this.products.findIndex(p => p.id === product.id);

      const products = [...this.products];
      if (index < 0) {
        products.push(product);
        this.productService.updateProducts(products);
        this.purchaseForm.patchValue({
          selectedProduct: product,
          selectedProductStock: product.stock ?? 0,
          selectedProductCost: product.cost != null ? this.currencyPipe.transform(product.cost, 'USD') : null,
          unitCost: product.cost,
        });
        this.isSelectedProduct = true;
      }
    }
  }

}
