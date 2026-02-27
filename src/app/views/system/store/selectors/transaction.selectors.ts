import {createFeatureSelector, createSelector} from "@ngrx/store";

import {State, transactionFeatureKey} from "../reducers/transaction.reducer";


const selectTransactionsState = createFeatureSelector<State>(transactionFeatureKey);

export const selectFoundTransactions = createSelector(
  selectTransactionsState,
  (state: State) => state.transactions
)

export const selectUpdatedTransaction = createSelector(
  selectTransactionsState,
  (state: State) => state.updatedTransaction
)

export const selectEndedTransaction = createSelector(
  selectTransactionsState,
  (state: State) => state.endedTransaction
)

export const selectChangedStatus = createSelector(
  selectTransactionsState,
  (state: State) => state.changedTransactionStatus
)

export const selectLoading = createSelector(
  selectTransactionsState,
  (state: State) => state.loading
)

export const selectError = createSelector(
  selectTransactionsState,
  (state: State) => state.error
)
