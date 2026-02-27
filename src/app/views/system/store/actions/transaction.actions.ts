import {createAction, props} from "@ngrx/store";

import {EndTransaction} from "src/app/views/system/models/end-transactions.model";
import {Transaction} from "src/app/views/system/models/transaction.model";


export const searchTransaction = createAction(
  '[Transactions] Search transactions',
  props<{ startDate: string, endDate: string, location_id: number[], location: number }>()
)

export const getTransactionsSuccess = createAction(
  '[Transactions] Get transactions success',
  props<{ transactions: Transaction[] }>()
)

export const addTransaction = createAction(
  '[Transactions] Add transaction',
  props<{ transaction: Transaction }>()
)

export const updateTransactionSuccess = createAction(
  '[Transactions] Update transaction',
  props<{ updatedTransaction: Transaction }>()
)

export const changeTransactionStatus = createAction(
  '[Transactions] Change transaction status',
  props<{ id: number, status: boolean, comment: string, userId: number }>()
)

export const changeTransactionStatusSuccess = createAction(
  '[Transactions] Change transaction status success',
  props<{ changedTransactionStatus: Transaction }>()
)

export const startTransaction = createAction(
  '[Transactions] Start transaction by location',
  props<{ location_id: number, user_id: number }>()
)

export const endTransaction = createAction(
  '[Transactions] End transaction by location',
  props<{ endTransaction: EndTransaction }>()
)

export const getEndedTransactionSuccess = createAction(
  '[Transactions] Get end transaction',
  props<{ endedTransaction: Transaction }>()
)

export const updateTransactions = createAction(
  '[Transactions] Update transactions',
  props<{ transactions: Transaction[] }>()
)

export const transactionFails = createAction(
  '[Transactions] Transaction fails',
  props<{ error: any }>()
)
