import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {CategoryService} from "src/app/views/expenses/services/category.service";
import {LocationService} from "src/app/views/expenses/services/location.service";
import {ProviderService} from "src/app/views/system/services/provider.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Category} from "src/app/views/expenses/models/category.model";
import {Location} from "src/app/views/expenses/models/location.model";
import {Product} from "src/app/views/expenses/models/product.model";
import {Provider} from "src/app/views/system/models/provider.model";

import {environment} from "src/environments/environment";


@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit, OnDestroy {
  @Output() sendProduct = new EventEmitter<Product>();
  @ViewChild('fileImage') fileImage: ElementRef | undefined;
  categories: Category[] = [];
  isModalVisible = false;
  locations: Location[] = [];
  modalTitle: string | undefined;
  // @ts-ignore
  productForm: FormGroup;
  productId = 0;
  productIsActive = true;
  providers: Provider[] = [];
  subscriptions: Subscription[] = [];
  // @ts-ignore
  preview: string;
  hideFields: boolean;
  fromPurchases = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private providerService: ProviderService,
    private service: UtilitiesService,
  ) {
    this.hideFields = environment.hideFields;
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      brand_code: [''],
      company_code: [''],
      distributor_code: [''],
      internal_code: [''],
      barcode: [''],
      description: ['', [Validators.required, Validators.minLength(5)]],
      stock: [0],
      minimum_stock: [0, [Validators.required, Validators.min(0)]],
      cost: [0],
      sale_price: [0, [Validators.required, Validators.min(0)]],
      wholesale_price: [0],
      discount: [0],
      image: [null],
      category_id: ['', [Validators.required]],
      provider_id: ['', [Validators.required]],
      location_id: ['', [Validators.required]],
      is_exempt_product: [false],
    });

    this.categoryService.getCategories();
    this.locationService.getLocations();
    this.providerService.getProviders();

    this.subscriptions[0] = this.categoryService.selectCategories().subscribe(categories => this.categories = categories);
    this.subscriptions[1] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
    this.subscriptions[2] = this.providerService.selectProviders().subscribe(providers => this.providers = providers);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(product: Product | undefined = undefined, fromPurchases = false): void {
    this.isModalVisible = !this.isModalVisible;
    this.fromPurchases = fromPurchases;

    this.productForm.controls['stock'].setValidators(null);
    this.productForm.controls['cost'].setValidators(null);
    this.productForm.controls['sale_price'].setValidators(null);
    this.productForm.controls['minimum_stock'].setValidators(null);
   
    this.productForm.controls['stock'].updateValueAndValidity();
    this.productForm.controls['cost'].updateValueAndValidity();
    this.productForm.controls['sale_price'].updateValueAndValidity();
    this.productForm.controls['minimum_stock'].updateValueAndValidity();

    if (product) {
      this.productId = product.id;
      this.productIsActive = product.active;
      this.modalTitle = 'Editar producto';
      this.setFormData(product);
    } else {
      this.productId = 0;
      this.productIsActive = true;
      this.modalTitle = 'Agregar producto';
      this.setDefaultValuesDropdown();
    }
  }

  setDefaultValuesDropdown(): void {
    this.productForm.patchValue({
      category_id: null,
    provider_id: null,
    location_id: null,
    });
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.preview = '';
      if (this.fileImage) {
        this.fileImage.nativeElement.value = '';
      }
      this.productForm.reset({
        is_exempt_product: false
      });
      this.productId = 0;
      this.productIsActive = true;
      this.fromPurchases = false;
    }
  }

  setFormData(product: Product): void {
    this.productForm.patchValue({
      brand_code: product.brand_code === 'null' ? null : product.brand_code,
      company_code: product.company_code === 'null' ? null : product.company_code,
      is_exempt_product: product.is_exempt_product? product.is_exempt_product : false,
      distributor_code: product.distributor_code === 'null' ? null : product.distributor_code,
      internal_code: product.internal_code === 'null' ? null : product.internal_code,
      barcode: product.barcode === 'null' ? null : product.barcode,
      description: product.description === 'null' ? null : product.description,
      stock: product.stock,
      minimum_stock: product.minimum_stock,
      cost: product.cost,
      sale_price: product.sale_price,
      wholesale_price: product.wholesale_price,
      discount: product.discount,
      image: null,
      // @ts-ignore
      category_id: this.categories.find(c => c.id === product.category_id),
      // @ts-ignore
      provider_id: this.providers.find(p => p.id === product.provider_id),
      // @ts-ignore
      location_id: this.locations.find(l => l.id === product.location_id),
    });
  }

  buildProduct(): Product {
    const product: Product = this.productForm.value;
    product.is_exempt_product = product.is_exempt_product ?? false;
    product.id = this.productId;
    product.active = this.productIsActive;
    product.quantity = 0;
    product.image = '';

    return product;
  }

  onSaveChanges(): void {
    const product = this.buildProduct();
    this.sendProduct.emit(product);

    this.isModalVisible = false;
    this.fromPurchases = false;
  }

  compareProvider(originalProvider: Provider, selectedProvider: Provider): boolean {
    if (originalProvider == null || selectedProvider == null) {
      return false;
    }

    return originalProvider.id === selectedProvider.id;
  }

  compareCategory(originalCategory: Category, selectedCategory: Category): boolean {
    if (originalCategory == null || selectedCategory == null) {
      return false;
    }

    return originalCategory.id === selectedCategory.id;
  }

  compareLocation(originalLocation: Location, selectedLocation: Location): boolean {
    if (originalLocation == null || selectedLocation == null) {
      return false;
    }

    return originalLocation.id === selectedLocation.id;
  }

  showPreview(event: any): void {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.productForm.patchValue({image: file});
    // @ts-ignore
    this.productForm.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;

    reader.readAsDataURL(file);
  }

}
