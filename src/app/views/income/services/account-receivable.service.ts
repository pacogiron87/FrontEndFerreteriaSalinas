import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";

import * as actions from "../store/actions/accounts-receivable.actions";
import * as selectors from "../store/selectors/accounts-receivable.selectors";
import { State } from "../store/reducers/accounts-receivable.reducer";

import { Payment } from "../models/payment.model";
import { Sale } from "../models/sale.model";


@Injectable({
  providedIn: 'root'
})
export class AccountReceivableService {

  constructor(
    private store: Store<State>
  ) {
  }

  searchPendingPayments(customerId: number): void {
    this.store.dispatch(actions.searchPendingPayments({ customerId }));
  }

  addPayment(payment: Payment): void {
    this.store.dispatch(actions.addPayment({ payment }));
  }

  clearSavedPayment(): void {
    this.store.dispatch(actions.addPaySuccess({ payment: null as any }));
  }

  selectFoundPendingPayments(): Observable<Sale[]> {
    return this.store.select(selectors.selectPendingPayments);
  }

  selectPayment(): Observable<Payment> {
    return this.store.select(selectors.selectPayment);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
