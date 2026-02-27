import {createFeatureSelector, createSelector} from "@ngrx/store";

import {saleFeatureKey, State} from "../reducers/sale.reducer";


const selectSalesState = createFeatureSelector<State>(saleFeatureKey);

export const selectSales = createSelector(
  selectSalesState,
  (state: State) => state.sales
)

export const selectFoundSales = createSelector(
  selectSalesState,
  (state: State) => state.foundSales
)

export const selectSalesByCustomer = createSelector(
  selectSalesState,
  (state: State) => state.salesByCustomer
)

export const selectAddedSale = createSelector(
  selectSalesState,
  (state: State) => state.addedSale
)

export const selectIsLoading = createSelector(
  selectSalesState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectSalesState,
  (state: State) => state.error
)
