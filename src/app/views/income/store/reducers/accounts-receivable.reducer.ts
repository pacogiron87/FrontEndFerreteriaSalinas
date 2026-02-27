import {createReducer, on} from "@ngrx/store";

import * as actions from "../actions/accounts-receivable.actions";

import {Payment} from "src/app/views/income/models/payment.model";
import {Sale} from "src/app/views/income/models/sale.model";


export const paymentFeatureKey = 'payments';

export interface State {
  payment: Payment,
  pendingSales: Sale[],
  isLoading: boolean,
  error: any,
}

export const initialState: State = {
  // @ts-ignore
  payment: null,
  pendingSales: [],
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.searchPendingPayments, state => ({...state, isLoading: true})),
  on(actions.searchPendingPaymentsSuccess, (state, {pendingSales}) => ({...state, pendingSales, isLoading: false})),
  on(actions.addPayment, state => ({...state, isLoading: true})),
  on(actions.addPaySuccess, (state, {payment}) => ({...state, payment, isLoading: false})),
  on(actions.pendingPaymentFails, (state, {error}) => ({...state, error, isLoading: false})),
)
