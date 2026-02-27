import {createAction, props} from "@ngrx/store";

import {Payment} from "src/app/views/income/models/payment.model";
import {Sale} from "src/app/views/income/models/sale.model";


export const searchPendingPayments = createAction(
  '[Accounts receivable] Search pending payments by customer identifier',
  props<{ customerId: number }>()
)

export const searchPendingPaymentsSuccess = createAction(
  '[Accounts receivable] Get pending payments by customer identifier success',
  props<{ pendingSales: Sale[] }>()
)

export const addPayment = createAction(
  '[Accounts receivable] Add new payment',
  props<{ payment: Payment }>()
)

export const addPaySuccess = createAction(
  '[Accounts receivable] Add new payment success',
  props<{ payment: Payment }>()
)

export const pendingPaymentFails = createAction(
  '[Accounts receivable] Pending payment fails',
  props<{ error: any }>()
)
