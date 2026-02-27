import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/transaction.actions';

import {EndTransaction} from "src/app/views/system/models/end-transactions.model";
import {Transaction} from "src/app/views/system/models/transaction.model";


export const transactionFeatureKey = 'transactions';

export interface State {
  transactions: Transaction[];
  updatedTransaction: Transaction;
  changedTransactionStatus: Transaction;
  endedTransaction: Transaction;
  success: boolean;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  transactions: [],
  // @ts-ignore
  updatedTransaction: null,
  // @ts-ignore
  changedTransactionStatus: null,
  // @ts-ignore
  endedTransaction: null,
  success: false,
  loading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.searchTransaction, state => ({...state, loading: true})),
  on(actions.getTransactionsSuccess, (state, {transactions}) => ({...state, transactions, loading: false})),
  on(actions.addTransaction, state => ({...state, loading: true})),
  on(actions.updateTransactionSuccess, (state, {updatedTransaction}) => ({...state, updatedTransaction, loading: false})),
  on(actions.changeTransactionStatus, state => ({...state, loading: true})),
  on(actions.changeTransactionStatusSuccess, (state, {changedTransactionStatus}) => ({...state, changedTransactionStatus, loading: false})),
  on(actions.startTransaction, state => ({...state, loading: true})),
  on(actions.endTransaction, state => ({...state, loading: true})),
  on(actions.getEndedTransactionSuccess, (state, {endedTransaction}) => ({...state, endedTransaction, loading: false})),
  on(actions.updateTransactions, (state, {transactions}) => ({...state, transactions})),
  on(actions.transactionFails, (state, {error}) => ({...state, error, loading: false})),
)
