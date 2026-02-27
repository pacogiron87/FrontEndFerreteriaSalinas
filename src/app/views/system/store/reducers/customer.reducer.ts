import {createReducer, on} from '@ngrx/store';

import * as actions from '../actions/customer.actions';

import {Customer} from "src/app/views/system/models/customer.model";


export const customerFeatureKey = 'customers';

export interface State {
  customers: Customer[];
  savedCustomer: Customer;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  customers: [],
  // @ts-ignore
  savedCustomer: null,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getCustomers, state => ({...state, isLoading: true})),
  on(actions.getCustomersSuccess, (state, {customers}) => ({...state, customers, isLoading: false})),
  on(actions.createCustomer, state => ({...state, isLoading: true})),
  on(actions.updateCustomer, state => ({...state, isLoading: true})),
  on(actions.updateCustomers, (state, {customers}) => ({...state, customers})),
  on(actions.updateCustomerSuccess, (state, {savedCustomer}) => ({...state, savedCustomer, isLoading: false})),
  on(actions.changeStatusCustomer, state => ({...state, isLoading: true})),
  on(actions.customerFails, (state, {error}) => ({...state, isLoading: false, error})),
)
