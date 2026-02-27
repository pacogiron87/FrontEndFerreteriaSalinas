import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import * as actions from "../store/actions/purchase.actions";
import * as selectors from "../store/selectors/purchase.selectors";
import {State} from "../store/reducers/purchase.reducer";

import {Purchase} from "../models/purchase.model";


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  constructor(
    private store: Store<State>
  ) {
  }

  searchPurchases(searchInformation: any): void {
    this.store.dispatch(actions.searchPurchases({
      customerName: searchInformation.customerName,
      startDate: searchInformation.startDate,
      endDate: searchInformation.endDate,
      categoriesId: searchInformation.categoriesId,
      location: searchInformation.location,
    }));
  }

  addPurchase(purchase: Purchase): void {
    this.store.dispatch(actions.addPurchase({purchase}));
  }

  updatePurchases(purchases: Purchase[]): void {
    this.store.dispatch(actions.updatePurchases({purchases}));
  }

  selectFoundPurchases(): Observable<Purchase[]> {
    return this.store.select(selectors.selectFoundPurchases);
  }

  selectAddedPurchase(): Observable<Purchase> {
    return this.store.select(selectors.selectAddedPurchase);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
