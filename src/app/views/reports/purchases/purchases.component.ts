import { Component, OnInit, signal, computed, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';

// Services
import { CategoryService } from "src/app/views/expenses/services/category.service";
import { LocationService } from "src/app/views/expenses/services/location.service";
import { PurchaseService } from "src/app/views/expenses/services/purchase.service";
import { NotificationService } from "src/app/core/helpers/notification.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Purchase } from "src/app/views/expenses/models/purchase.model";
import { PurchaseDetail } from "src/app/views/expenses/models/purchase-detail.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-purchase-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    DialogModule,
    MultiSelectModule,
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    SelectModule,
    RippleModule
  ],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchaseReportComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly locationService = inject(LocationService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly notificationService = inject(NotificationService);
  public readonly utilitiesService = inject(UtilitiesService);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly isModalVisible = signal(false);
  readonly modalTitle = signal('');
  readonly maxDate = signal(new Date());
  
  readonly purchases = toSignal(this.purchaseService.selectFoundPurchases(), { initialValue: [] });
  readonly categories = toSignal(this.categoryService.selectCategories(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly loading = toSignal(this.purchaseService.selectIsLoading(), { initialValue: false });

  readonly details = signal<PurchaseDetail[]>([]);

  readonly totalAmount = computed(() => this.purchases().reduce((acc, p) => acc + (p.total || 0), 0));
  readonly totalMessage = computed(() => {
    const total = this.totalAmount();
    return total > 0 ? `Importe total: ${this.currencyPipe.transform(total)}` : 'No hay compras para calcular importe';
  });

  searchForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.locationService.getLocations();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      customerName: [''],
      startDate: [null],
      endDate: [null],
      categories: [[]],
      location: [null],
    });
  }

  search(): void {
    const val = this.searchForm.value;
    const hasFilters = val.customerName?.trim() || val.startDate || val.endDate || val.categories?.length > 0;
    if (!hasFilters) { this.notificationService.warning('Debe llenar al menos un campo.'); return; }
    if (val.startDate && val.endDate && val.startDate > val.endDate) { this.notificationService.warning('Fechas inválidas.'); return; }

    this.purchaseService.searchPurchases({
      customerName: val.customerName || '',
      startDate: val.startDate ? this.utilitiesService.formatDate(val.startDate) : '',
      endDate: val.endDate ? this.utilitiesService.formatDate(val.endDate) : '',
      categoriesId: val.categories.map((c: any) => c.id).join(','),
      location: val.location?.id || 0
    });
  }

  seeDetails(purchase: Purchase): void {
    this.modalTitle.set(purchase.invoice_number === 0 ? 'Detalles' : `Compra #${purchase.invoice_number}`);
    // @ts-ignore
    this.details.set(purchase.purchaseDetailResponseModels || []);
    this.isModalVisible.set(true);
  }

  closeDetails(): void { this.isModalVisible.set(false); this.details.set([]); }
}
