import { Component, OnInit, signal, computed, inject, viewChild, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';

// Shared Components
import { ProductModalComponent } from "../../shared/product-modal/product-modal.component";

// Services
import { CategoryService } from "../services/category.service";
import { LocationService } from "../services/location.service";
import { ProductService } from "../services/product.service";
import { ProviderService } from "../../system/services/provider.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Product } from "../models/product.model";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    BadgeModule,
    CardModule,
    RippleModule,
    TagModule,
    ProductModalComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  // Services
  private readonly categoryService = inject(CategoryService);
  private readonly locationService = inject(LocationService);
  private readonly productService = inject(ProductService);
  private readonly providerService = inject(ProviderService);
  public readonly utilitiesService = inject(UtilitiesService);

  // ViewChilds with Signals
  readonly productModal = viewChild(ProductModalComponent);

  // Data from Store
  readonly allProducts = toSignal(this.productService.selectProducts(), { initialValue: [] });
  readonly categories = toSignal(this.categoryService.selectCategories(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly providers = toSignal(this.providerService.selectProviders(), { initialValue: [] });
  readonly loading = toSignal(this.productService.selectIsLoading(), { initialValue: true });

  // Computed Signal for Rich Products (mapped data for the UI)
  readonly products = computed(() => {
    const categoriesList = this.categories();
    const providersList = this.providers();
    const locationsList = this.locations();
    
    return this.allProducts().map(product => ({
      ...product,
      categoryName: categoriesList.find(c => Number(c.id) === Number(product.category_id))?.name || 'N/A',
      providerName: providersList.find(p => Number(p.id) === Number(product.provider_id))?.tradename || 'N/A',
      locationName: locationsList.find(l => Number(l.id) === Number(product.location_id))?.name || 'N/A',
      isLowStock: product.stock <= product.minimum_stock
    }));
  });

  constructor() {
    effect(() => {
      const savedProduct = toSignal(this.productService.selectSavedProduct())();
      if (savedProduct) this.handleProductUpdate(savedProduct);
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.locationService.getLocations();
    this.productService.getAllProducts();
    this.providerService.getProviders();
  }

  saveProduct(product: Product): void {
    if (product.id > 0) {
      this.productService.updateProduct(product);
    } else {
      this.productService.createProduct(product);
    }
  }

  changeStatus(product: Product, active: boolean): void {
    this.productService.changeStatusProduct(product.id, active);
  }

  private handleProductUpdate(product: Product): void {
    const products = [...this.allProducts()];
    const index = products.findIndex(p => p.id === product.id);

    if (index >= 0) {
      if (!product.description) {
        products[index] = { ...products[index], active: !products[index].active };
      } else {
        products[index] = product;
      }
    } else {
      products.push(product);
    }
    
    this.productService.updateProducts(products);
  }
}
