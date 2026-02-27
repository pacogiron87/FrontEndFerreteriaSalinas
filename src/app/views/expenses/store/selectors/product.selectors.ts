import {createFeatureSelector, createSelector} from "@ngrx/store";

import {productFeatureKey, State} from '../reducers/product.reducer';


const selectProductsState = createFeatureSelector<State>(productFeatureKey);

export const selectProducts = createSelector(
  selectProductsState,
  (state: State) => state.products
)

export const selectSavedProduct = createSelector(
  selectProductsState,
  (state: State) => state.savedProduct
)

export const selectIsLoading = createSelector(
  selectProductsState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectProductsState,
  (state: State) => state.error
)
