import {createFeatureSelector, createSelector} from "@ngrx/store";

import {saleReportFeatureKey, State} from "../reducers/sales.reducer";


const selectSalesReportState = createFeatureSelector<State>(saleReportFeatureKey);

export const selectSales = createSelector(
  selectSalesReportState,
  (state: State) => state.sales
)

export const selectIsLoading = createSelector(
  selectSalesReportState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectSalesReportState,
  (state: State) => state.error
)
