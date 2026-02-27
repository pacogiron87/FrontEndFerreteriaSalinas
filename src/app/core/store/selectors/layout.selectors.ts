import {createFeatureSelector, createSelector} from "@ngrx/store";

import {layoutFeatureKey, State} from "../reducers/layout.reducer";


const selectLayoutState = createFeatureSelector<State>(layoutFeatureKey);

export const selectError = createSelector(
  selectLayoutState,
  (state: State) => state.error
)
