import {createFeatureSelector, createSelector} from "@ngrx/store";

import {paymentFeatureKey, State} from "../reducers/accounts-receivable.reducer";


const selectPaymentsState = createFeatureSelector<State>(paymentFeatureKey);

export const selectPendingPayments = createSelector(
  selectPaymentsState,
  (state: State) => state.pendingSales
)

export const selectPayment = createSelector(
  selectPaymentsState,
  (state: State) => state.payment
)

export const selectIsLoading = createSelector(
  selectPaymentsState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectPaymentsState,
  (state: State) => state.error
)
