import {createAction, props} from '@ngrx/store';

import {Customer} from 'src/app/views/system/models/customer.model';


export const getCustomers = createAction(
  '[Customers] Get customers'
)

export const getCustomersSuccess = createAction(
  '[Customers] Get customers success',
  props<{ customers: Customer[] }>()
)

export const createCustomer = createAction(
  '[Customers] Create customer',
  props<{ customer: Customer }>()
)

export const updateCustomer = createAction(
  '[Customers] Update customer',
  props<{ customer: Customer }>()
)

export const updateCustomers = createAction(
  '[Customers] Update customers',
  props<{ customers: Customer[] }>()
)

export const updateCustomerSuccess = createAction(
  '[Customers] Update customer success',
  props<{ savedCustomer: Customer }>()
)

export const changeStatusCustomer = createAction(
  '[Customers] Change status customer',
  props<{ id: number, active: boolean }>()
)

export const customerFails = createAction(
  '[Customers] Customer fails',
  props<{ error: any }>()
)
