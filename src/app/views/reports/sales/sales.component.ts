import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

// Services
import { NotificationService } from "src/app/core/helpers/notification.service";
import { SaleService } from "src/app/views/income/services/sale.service";
import { CategoryService } from "src/app/views/expenses/services/category.service";
import { SalesService as MigratedSalesService } from "../services/sales.service";
import { LocationService } from "src/app/views/expenses/services/location.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Category } from "src/app/views/expenses/models/category.model";
import { BillDetail } from "src/app/views/income/models/bill-detail.model";
import { Bill } from "src/app/views/income/models/bill.model";
import { Sale } from "src/app/views/income/models/sale.model";
import { Location } from "src/app/views/expenses/models/location.model";

@Component({
  selector: 'app-sales-report',
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
    TooltipModule,
    ToastModule,
    BadgeModule,
    CardModule,
    RippleModule,
    TabsModule,
    SelectModule,
    TagModule
  ],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesReportComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly notificationService = inject(NotificationService);
  private readonly categoryService = inject(CategoryService);
  private readonly saleService = inject(SaleService);
  private readonly migratedSalesService = inject(MigratedSalesService);
  public readonly utilitiesService = inject(UtilitiesService);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly tabIndex = signal(0);
  readonly isModalVisible = signal(false);
  readonly modalTitle = signal('');
  readonly maxDate = signal(new Date());
  
  readonly sales = toSignal(this.saleService.selectFoundSales(), { initialValue: [] });
  readonly bills = toSignal(this.migratedSalesService.selectSales(), { initialValue: [] });
  readonly categories = toSignal(this.categoryService.selectCategories(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly loading = toSignal(this.saleService.selectIsLoading(), { initialValue: false });

  readonly details = signal<BillDetail[]>([]);

  readonly totalCurrentSales = computed(() => this.sales().reduce((acc, s) => acc + s.total_sale, 0));
  readonly totalMigratedSales = computed(() => this.bills().reduce((acc, b) => acc + b.total, 0));

  readonly totalMessage = computed(() => {
    const total = this.tabIndex() === 0 ? this.totalCurrentSales() : this.totalMigratedSales();
    return total > 0 ? `Importe total: ${this.currencyPipe.transform(total)}` : 'No hay ventas para calcular';
  });

  searchForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.locationService.getLocations();
    this.categoryService.getCategories();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      customerName: [''], startDate: [null], endDate: [null], category: [null], location: [null],
    });
  }

  onTabChange(event: any): void { this.tabIndex.set(event.index); }

  search(): void {
    const val = this.searchForm.value;
    if (!val.customerName?.trim() && !val.startDate && !val.endDate) { this.notificationService.warning('Llene al menos un campo.'); return; }
    
    const searchInfo = {
      customerName: val.customerName || '',
      startDate: val.startDate ? val.startDate : '',
      endDate: val.endDate ? val.endDate : '',
      categoryName: val.category?.id || 0,
      location: val.location?.id || 0
    };

    if (this.tabIndex() === 0) this.saleService.searchSales(searchInfo);
    else this.migratedSalesService.searchSales(searchInfo);
  }

  seeDetails(bill?: Bill, sale?: Sale): void {
    const invoiceNumber = bill ? bill.numero_Correlativo : sale?.invoice_number;
    this.modalTitle.set(invoiceNumber === 0 ? 'Detalles' : `Factura #${invoiceNumber}`);
    if (bill) this.details.set(bill.billingDetails);
    else if (sale) {
      this.details.set(sale.saleDetails.map(d => ({
        idSalesDetailsMigration: 0, cantidad: d.quantity, descripcion: d.description_item,
        idCliente: sale.customer_id, idDetalle: d.id, idTotalFactura: d.id_sale,
        precio_Unitario: d.unit_price, ventas_Afectas: d.affected_sale,
        ventas_Excentas: d.exception_sale, ventas_No_Sujetas: d.non_tax_sale,
      })));
    }
    this.isModalVisible.set(true);
  }

  closeDetails(): void { this.isModalVisible.set(false); this.details.set([]); }
}
