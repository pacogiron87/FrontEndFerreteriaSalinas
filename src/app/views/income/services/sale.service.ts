import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";

import * as actions from '../store/actions/sale.actions';
import * as selectors from '../store/selectors/sale.selectors';
import { State } from "../store/reducers/sale.reducer";

import { Sale } from "../models/sale.model";
import { EmailParameter } from "../models/email-parameter.model";


@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(
    private store: Store<State>
  ) {
  }

  getAllSales(): void {
    this.store.dispatch(actions.getAllSales());
  }

  clearAddedSale(): void {
    this.store.dispatch(actions.addSaleSuccess({ addedSale: null as any }));
  }

  searchSales(searchInformation: any): void {
    this.store.dispatch(actions.searchSales({
      customerName: searchInformation.customerName,
      startDate: searchInformation.startDate,
      endDate: searchInformation.endDate,
      categoryName: searchInformation.categoryName,
      location: searchInformation.location,
    }));
  }

  searchSalesByCustomer(customerId: number): void {
    this.store.dispatch(actions.searchSalesByCustomer({
      customerId,
    }));
  }

  addSale(sale: Sale): void {
    this.store.dispatch(actions.addSale({ sale }));
  }

  updateSales(sales: Sale[]): void {
    this.store.dispatch(actions.updateSales({ sales }));
  }
  paySale(sale: Sale): void {
    this.store.dispatch(actions.paySale({ sale }));
  }

  selectSales(): Observable<Sale[]> {
    return this.store.select(selectors.selectSales);
  }

  selectFoundSales(): Observable<Sale[]> {
    return this.store.select(selectors.selectFoundSales);
  }

  selectSalesByCustomer(): Observable<Sale[]> {
    return this.store.select(selectors.selectSalesByCustomer);
  }

  selectAddedSale(): Observable<Sale> {
    return this.store.select(selectors.selectAddedSale);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

  addSaleInvoiceDte(sale: Sale): void {
    this.store.dispatch(actions.addSaleInvoiceDte({ sale }));
  }

  addSaleTaxCreditDte(sale: Sale): void {
    this.store.dispatch(actions.addSaleTaxCreditDte({ sale }));
  }

  addSendEmailDte(emailParameters: EmailParameter): void {
    this.store.dispatch(actions.addSendEmailDte({ emailParameters }));
  }

}
