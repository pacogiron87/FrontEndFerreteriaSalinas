import {createFeatureSelector, createSelector} from "@ngrx/store";

import {State, customerFeatureKey} from "../reducers/customer.reducer";


const selectCustomersState = createFeatureSelector<State>(customerFeatureKey);

export const selectCustomers = createSelector(
  selectCustomersState,
  (state: State) => state.customers
)

export const selectSavedCustomer = createSelector(
  selectCustomersState,
  (state: State) => state.savedCustomer
)

export const selectIsLoading = createSelector(
  selectCustomersState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectCustomersState,
  (state: State) => state.error
)
