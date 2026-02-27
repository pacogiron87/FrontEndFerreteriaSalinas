import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

import {CategoryService} from "src/app/views/expenses/services/category.service";
import {NotificationService} from "src/app/core/helpers/notification.service";
import {PurchaseService} from "src/app/views/expenses/services/purchase.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Category} from "src/app/views/expenses/models/category.model";
import {Purchase} from "src/app/views/expenses/models/purchase.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";
import {PurchaseDetail} from "../../expenses/models/purchase-detail.model";
import {LocationService} from "src/app/views/expenses/services/location.service";
import {Location} from "src/app/views/expenses/models/location.model";


@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit, OnDestroy {
  // @ts-ignore
  searchForm: FormGroup;
  // @ts-ignore
  maxDate: Date;
  searchInformation = {
    customerName: '',
    startDate: '',
    endDate: '',
    categoriesId: '',
    location:0,
  };
  locations: Location[] = [];
  purchases: Purchase[] = [];
  details: PurchaseDetail[] = [];
  statusTypeData = StatusTypeData;
  loading = false;
  subscriptions: Subscription[] = [];
  categories: Category[] = [];
  isModalVisible = false;
  modalTitle: string | undefined;

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private purchasesService: PurchaseService,
    public utilitiesService: UtilitiesService,
  ) { }

  ngOnInit(): void {
    this.maxDate = new Date();

    this.searchForm = this.fb.group({
      customerName: [''],
      startDate: [''],
      endDate: [''],
      categoriesId: [[]],
      location: [''],
    });

    this.categoryService.getCategories();
    this.locationService.getLocations();
    this.subscriptions[0] = this.categoryService.selectCategories().subscribe(categories => this.categories = categories);
    this.subscriptions[1] = this.purchasesService.selectFoundPurchases().subscribe(purchases => this.purchases = purchases);
    this.subscriptions[2] = this.purchasesService.selectIsLoading().subscribe(loading => this.loading = loading);
    this.subscriptions[3] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

    if (this.searchInformation.categoriesId.length === 0) {
      count++;
    }

    if (count === 4) {
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
    this.searchInformation.startDate = this.utilitiesService.formatDate(this.searchInformation.startDate);
    this.searchInformation.endDate = this.utilitiesService.formatDate(this.searchInformation.endDate);
    this.purchasesService.searchPurchases(this.searchInformation);
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;
  }

  seeDetails(purchase: Purchase): void {
    this.modalTitle = purchase.invoice_number === 0 ? 'Detalles de la compra' : `Detalles de la compra #${purchase.invoice_number}`;
    // @ts-ignore
    this.details = purchase.purchaseDetailResponseModels;
    this.isModalVisible = true;
  }

  closeDetails(): void {
    this.isModalVisible = false;
    this.modalTitle = '';
  }

  getTotalWithMessage(): string {
    let total = 0;
    let message = 'No hay compras para calcular importe';

    // @ts-ignore
    this.purchases.forEach(purchase => total = total + purchase.total);

    if (total > 0) {
      message = `Importe total: ${this.currencyPipe.transform(total)}`;
    }

    return message;
  }

}
