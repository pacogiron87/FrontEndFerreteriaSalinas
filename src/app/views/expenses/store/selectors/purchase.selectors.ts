import {createFeatureSelector, createSelector} from "@ngrx/store";

import {purchaseFeatureKey, State} from "../reducers/purchase.reducer";


const selectPurchasesState = createFeatureSelector<State>(purchaseFeatureKey)

export const selectFoundPurchases = createSelector(
  selectPurchasesState,
  (state: State) => state.foundPurchases
)

export const selectAddedPurchase = createSelector(
  selectPurchasesState,
  (state: State) => state.addedPurchase
)

export const selectIsLoading = createSelector(
  selectPurchasesState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectPurchasesState,
  (state: State) => state.error
)
