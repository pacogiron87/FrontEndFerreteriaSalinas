import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";

import {ProductModalComponent} from "src/app/views/shared/product-modal/product-modal.component";

import {CategoryService} from "../services/category.service";
import {LocationService} from "../services/location.service";
import {ProductService} from "../services/product.service";
import {ProviderService} from "src/app/views/system/services/provider.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Category} from "../models/category.model";
import {Location} from "../models/location.model";
import {Product} from "../models/product.model";
import {Provider} from "src/app/views/system/models/provider.model";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild(ProductModalComponent) productModal!: ProductModalComponent;
  products: Product[] = [];
  loading = true;
  subscriptions: Subscription[] = [];
  providers: Provider[] = [];
  categories: Category[] = [];
  locations: Location[] = [];

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private productService: ProductService,
    private providerService: ProviderService,
    private service: UtilitiesService,
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.locationService.getLocations();
    this.productService.getAllProducts();
    this.providerService.getProviders();

    this.subscriptions[0] = this.categoryService.selectCategories().subscribe(categories => this.categories = categories);
    this.subscriptions[1] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
    this.subscriptions[2] = this.productService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[3] = this.productService.selectProducts().subscribe(products => [...this.products] = products);
    this.subscriptions[4] = this.productService.selectSavedProduct().subscribe(product => this.updateProduct(product));
    this.subscriptions[5] = this.providerService.selectProviders().subscribe(providers => this.providers = providers);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  updateProduct(product: Product): void {
    if (product) {
      const index = this.products.findIndex(p => p.id === product.id);

      const products = [...this.products];
      if (index >= 0) {
        if (!product.description) {
          product = {...products[index]};
          product.active = !product.active;
          products[index] = product;
          this.productService.updateProducts(products);
        } else {
          products[index] = product;
          this.productService.updateProducts(products);
        }
      } else {
        products.push(product);
        this.productService.updateProducts(products);
      }
    }
  }

  getProviderById(product: Product): string {
    // @ts-ignore
    const index = this.providers.findIndex(p => p.id === product.provider_id);
    return index !== -1 ? this.providers[index].tradename : '';
  }

  getCategoryById(product: Product): string {
    // @ts-ignore
    const index = this.categories.findIndex(c => c.id === product.category_id);
    return index !== -1 ? this.categories[index].name : '';
  }

  getLocationById(product: Product): string {
    // @ts-ignore
    const index = this.locations.findIndex(c => c.id === product.location_id);
    return index !== -1 ? this.locations[index].name : '';
  }

}
