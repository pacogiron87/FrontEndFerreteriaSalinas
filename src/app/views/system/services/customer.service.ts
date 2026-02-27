import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import {State} from "../store/reducers/customer.reducer";
import * as actions from "../store/actions/customer.actions";
import * as selectors from "../store/selectors/customer.selectors";

import {Customer} from "../models/customer.model";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private store: Store<State>
  ) {
  }

  getCustomers(): void {
    this.store.dispatch(actions.getCustomers());
  }

  createCustomer(customer: Customer): void {
    this.store.dispatch(actions.createCustomer({customer}));
  }

  updateCustomer(customer: Customer): void {
    this.store.dispatch(actions.updateCustomer({customer}));
  }

  updateCustomers(customers: Customer[]): void {
    this.store.dispatch(actions.updateCustomers({customers}));
  }

  selectCustomers(): Observable<Customer[]> {
    return this.store.select(selectors.selectCustomers);
  }

  selectSavedCustomer(): Observable<Customer> {
    return this.store.select(selectors.selectSavedCustomer);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
