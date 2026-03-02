import { Component, OnInit, signal, computed, inject, output, model, viewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

// Services
import { CategoryService } from "src/app/views/expenses/services/category.service";
import { LocationService } from "src/app/views/expenses/services/location.service";
import { ProviderService } from "src/app/views/system/services/provider.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models & Env
import { Category } from "src/app/views/expenses/models/category.model";
import { Location } from "src/app/views/expenses/models/location.model";
import { Product } from "src/app/views/expenses/models/product.model";
import { Provider } from "src/app/views/system/models/provider.model";
import { environment } from "src/environments/environment";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    ToggleSwitchModule,
    TooltipModule,
    RippleModule,
    FloatLabel,
    IconField,
    InputIcon
  ],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly locationService = inject(LocationService);
  private readonly providerService = inject(ProviderService);
  public readonly utilitiesService = inject(UtilitiesService);

  sendProduct = output<Product>();

  isModalVisible = model(false);
  productId = signal(0);
  productIsActive = signal(true);
  modalTitle = signal('Agregar producto');
  preview = signal<string | null>(null);
  fromPurchases = signal(false);
  hideFields = signal(environment.hideFields);

  categories = toSignal(this.categoryService.selectCategories(), { initialValue: [] });
  locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  providers = toSignal(this.providerService.selectProviders(), { initialValue: [] });

  productForm!: FormGroup;
  fileInput = viewChild<ElementRef>('fileImage');

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.locationService.getLocations();
    this.providerService.getProviders();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      brand_code: [''], company_code: [''], distributor_code: [''], internal_code: [''], barcode: [''],
      description: ['', [Validators.required, Validators.minLength(5)]],
      stock: [0], minimum_stock: [0, [Validators.required, Validators.min(0)]],
      cost: [0], sale_price: [0, [Validators.required, Validators.min(0)]],
      wholesale_price: [0], discount: [0], image: [null],
      category_id: [null, [Validators.required]], provider_id: [null, [Validators.required]],
      location_id: [null, [Validators.required]], is_exempt_product: [false],
    });
  }

  toggleModal(product?: Product, fromPurchases = false): void {
    this.fromPurchases.set(fromPurchases);
    if (product) {
      this.productId.set(product.id);
      this.productIsActive.set(product.active);
      this.modalTitle.set('Editar producto');
      this.setFormData(product);
    } else {
      this.productId.set(0); this.productIsActive.set(true); this.modalTitle.set('Agregar producto');
      this.productForm.reset({ stock: 0, minimum_stock: 0, cost: 0, sale_price: 0, wholesale_price: 0, discount: 0, is_exempt_product: false });
    }
    this.isModalVisible.set(true);
  }

  private setFormData(product: Product): void {
    this.productForm.patchValue({
      brand_code: product.brand_code !== 'null' ? product.brand_code : '',
      company_code: product.company_code !== 'null' ? product.company_code : '',
      is_exempt_product: product.is_exempt_product || false,
      distributor_code: product.distributor_code !== 'null' ? product.distributor_code : '',
      internal_code: product.internal_code !== 'null' ? product.internal_code : '',
      barcode: product.barcode !== 'null' ? product.barcode : '',
      description: product.description !== 'null' ? product.description : '',
      stock: product.stock, minimum_stock: product.minimum_stock, cost: product.cost,
      sale_price: product.sale_price, wholesale_price: product.wholesale_price, discount: product.discount,
      category_id: this.categories().find(c => Number(c.id) === Number(product.category_id)),
      provider_id: this.providers().find(p => Number(p.id) === Number(product.provider_id)),
      location_id: this.locations().find(l => Number(l.id) === Number(product.location_id)),
    });
  }

  onSaveChanges(): void {
    if (this.productForm.valid) {
      const formVal = this.productForm.value;
      this.sendProduct.emit({ ...formVal, id: this.productId(), active: this.productIsActive(), category_id: formVal.category_id?.id, provider_id: formVal.provider_id?.id, location_id: formVal.location_id?.id, image: '', quantity: 0 });
      this.isModalVisible.set(false);
    }
  }

  showPreview(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.productForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.preview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  handleModalChange(event: boolean): void { this.isModalVisible.set(event); if (!event) { this.preview.set(null); this.productForm.reset(); this.productId.set(0); } }
}
