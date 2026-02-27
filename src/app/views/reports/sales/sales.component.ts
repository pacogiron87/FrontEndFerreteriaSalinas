import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {SaleService} from "src/app/views/income/services/sale.service";
import {CategoryService} from "src/app/views/expenses/services/category.service";
import {SalesService} from "../services/sales.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Category} from "src/app/views/expenses/models/category.model";
import {BillDetail} from "src/app/views/income/models/bill-detail.model";
import {Bill} from "src/app/views/income/models/bill.model";
import {Sale} from "src/app/views/income/models/sale.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";
import {LocationService} from "src/app/views/expenses/services/location.service";
import {Location} from "src/app/views/expenses/models/location.model";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, OnDestroy {
  // @ts-ignore
  tabIndex: number;
  // @ts-ignore
  searchForm: FormGroup;
  // @ts-ignore
  maxDate: Date;
  searchInformation = {
    customerName: '',
    startDate: '',
    endDate: '',
    categoryName: 0,
    location:0,
  };
  locationInformation={    
    location: null,
    
}
  locations: Location[] = [];
  bills: Bill[] = [];
  details: BillDetail[] = [];
  sales: Sale[] = [];
  statusTypeData = StatusTypeData;
  loading = false;
  subscriptions: Subscription[] = [];
  categories: Category[] = [];
  isModalVisible = false;
  modalTitle: string | undefined;
  initialCategory: Category = {
    active: true,
    description: "(Todos las categorias)",
    id: 6,
    name: "(Todos las categorias)",
  };

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private saleService: SaleService,
    private salesService: SalesService,
    public utilitiesService: UtilitiesService,
    private currencyPipe: CurrencyPipe,
  ) {
  }

  ngOnInit(): void {
    this.maxDate = new Date();

    this.searchForm = this.fb.group({
      customerName: [''],
      startDate: [''],
      endDate: [''],
      categoryName: [this.initialCategory],
      location: [''],
    });
    this.locationService.getLocations();
    this.categoryService.getCategories();
    this.subscriptions[0] = this.saleService.selectFoundSales().subscribe((sales => [...this.sales] = sales));
    this.subscriptions[1] = this.saleService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[2] = this.salesService.selectSales().subscribe(bills => [...this.bills] = bills);
    this.subscriptions[3] = this.categoryService.selectCategories().subscribe(categories => this.categories = categories);
    this.subscriptions[4] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  setTabIndex(event: number): void {
    this.tabIndex = event;
  }

  search(): void {
    this.searchInformation = this.searchForm.value;
    let count = 0;

    if (this.searchInformation.customerName.trim().length === 0) {
      count++;
    }

    if (this.searchInformation.startDate === '') {
      count++;
    }

    if (this.searchInformation.endDate === '') {
      count++;
    }

    if (count === 3) {
      this.notificationService.warning('Debe llenar al menos un campo');
      return;
    }

    if (this.searchInformation.startDate !== '' && this.searchInformation.endDate !== '') {
      if (this.searchInformation.startDate > this.searchInformation.endDate) {
        this.notificationService.warning('La fecha inicial no puede ser mayor que la fecha final');
        return;
      } else {
        this.processSearch();
        return;
      }
    }

    this.processSearch();
  }

  processSearch(): void {
    this.searchInformation.startDate =this.searchInformation.startDate;
    this.searchInformation.endDate = this.searchInformation.endDate;
    if (this.tabIndex === 0) {
      this.saleService.searchSales(this.searchInformation);
    } else {
      this.salesService.searchSales(this.searchInformation);
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;
  }

  seeDetails(bill: Bill | null, sale: Sale | null): void {
    const invoiceNumber = bill != null ? bill.numero_Correlativo : sale!.invoice_number;
    this.modalTitle = invoiceNumber === 0 ? 'Detalles de la factura' : `Detalles de la factura #${invoiceNumber}`;
    if (bill != null) {
      this.details = bill.billingDetails;
    } else {
      const details: BillDetail[] = [];
      sale!.saleDetails.forEach(detail => details.push({
        idSalesDetailsMigration: 0,
        cantidad: detail.quantity,
        descripcion: detail.description_item,
        idCliente: sale!.customer_id,
        idDetalle: detail.id,
        idTotalFactura: detail.id_sale,
        precio_Unitario: detail.unit_price,
        ventas_Afectas: detail.affected_sale,
        ventas_Excentas: detail.exception_sale,
        ventas_No_Sujetas: detail.non_tax_sale,
      }));
      this.details = details;
    }
    this.isModalVisible = true;
  }

  closeDetails(): void {
    this.isModalVisible = false;
    this.modalTitle = '';
    this.details = [];
  }

  getTotalWithMessage(): string {
    let total = 0;
    let message = 'No hay ventas para calcular importe'

    if (this.tabIndex === 0) {
      this.sales.forEach(sale => total = total + sale.total_sale);
    } else {
      this.bills.forEach(bill => total = total + bill.total);
    }

    if (total > 0) {
      message = `Importe total: ${this.currencyPipe.transform(total)}`;
    }

    return message;
  }

  compareCategory(originalCategory: Category, selectedCategory: Category): boolean {
    if (originalCategory == null || selectedCategory == null) {
      return false;
    }

    return originalCategory.id === selectedCategory.id;
  }

}
