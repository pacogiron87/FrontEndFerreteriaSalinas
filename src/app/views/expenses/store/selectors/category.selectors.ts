import {createFeatureSelector, createSelector} from "@ngrx/store";

import {categoryFeatureKey, State} from "../reducers/category.reducer";


const selectCategoriesState = createFeatureSelector<State>(categoryFeatureKey);

export const selectCategories = createSelector(
  selectCategoriesState,
  (state: State) => state.categories
)

export const selectSavedCategory = createSelector(
  selectCategoriesState,
  (state: State) => state.savedCategory
)

export const selectIsLoading = createSelector(
  selectCategoriesState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectCategoriesState,
  (state: State) => state.error
)
