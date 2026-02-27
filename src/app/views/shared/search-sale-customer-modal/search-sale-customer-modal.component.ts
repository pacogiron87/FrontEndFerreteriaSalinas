import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

import {SaleService} from "src/app/views/income/services/sale.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Customer} from "src/app/views/system/models/customer.model";
import {Sale} from "src/app/views/income/models/sale.model";


@Component({
  selector: 'app-search-sale-customer-modal',
  templateUrl: './search-sale-customer-modal.component.html',
  styleUrls: ['./search-sale-customer-modal.component.scss']
})
export class SearchSaleCustomerModalComponent implements OnInit, OnDestroy {
  @Output() sendSale = new EventEmitter<Sale>();
  // @ts-ignore
  saleForm: FormGroup;
  isVisible = false;
  customerId = 0;
  subscriptions: Subscription[] = [];
  loading = false;
  sales: Sale[] = [];
  filteredSales: Sale[] = [];

  constructor(
    private fb: FormBuilder,
    private service: SaleService,
    public utilitiesService: UtilitiesService,
  ) { }

  ngOnInit(): void {
    this.saleForm = this.fb.group({
      product: [''],
    });

    this.subscriptions[0] = this.service.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[1] = this.service.selectSalesByCustomer().subscribe(sales => this.getSales(sales));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(customer: Customer | undefined = undefined): void {
    this.isVisible = !this.isVisible;

    if (customer) {
      this.customerId = customer.id;
      this.service.searchSalesByCustomer(this.customerId);
    } else {
      this.customerId = 0;
    }
  }

  handleModalChange(event: boolean): void {
    this.isVisible = event;

    if (!event) {
      this.saleForm.reset();
      this.customerId = 0;
    }
  }

  getSales(sales: Sale[]): void {
    [...this.sales] = sales;
    [...this.filteredSales] = sales;
  }

  filterSale(event: any): void {
    const product = event.target.value;
    [...this.filteredSales] = [];

    if (product.trim().length > 0) {
      this.sales.forEach(sale => {
        sale.saleDetails.every(element => {
          if (element.description_item.toLowerCase().includes(product.toLowerCase())) {
            this.filteredSales.push(sale);
            return false;
          } else {
            return true;
          }
        })
      });
    } else {
      [...this.filteredSales] = this.sales;
    }
  }

  selectSale(sale: Sale): void {
    this.sendSale.emit(sale);
    this.saleForm.reset();
    this.isVisible = false;
  }

}
