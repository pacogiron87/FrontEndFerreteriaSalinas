import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import {State} from "../store/reducers/sales.reducer";
import * as actions from '../store/actions/sales.actions';
import * as selectors from '../store/selectors/sales.selectors';

import {Bill} from "src/app/views/income/models/bill.model";


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    private store: Store<State>
  ) {
  }

  searchSales(searchInformation: any): void {
    this.store.dispatch(actions.getSales({
      customerName: searchInformation.customerName,
      startDate: searchInformation.startDate,
      endDate: searchInformation.endDate,
      categoryName: searchInformation.categoryName,
    }));
  }

  selectSales(): Observable<Bill[]> {
    return this.store.select(selectors.selectSales);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
