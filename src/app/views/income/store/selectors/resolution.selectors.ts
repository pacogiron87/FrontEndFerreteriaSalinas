import {createFeatureSelector, createSelector} from "@ngrx/store";

import {resolutionFeatureKey, State} from "../reducers/resolution.reducer";


const selectResolutionState = createFeatureSelector<State>(resolutionFeatureKey);

export const selectResolutions = createSelector(
  selectResolutionState,
  (state: State) => state.resolutions
)

export const selectSavedResolution = createSelector(
  selectResolutionState,
  (state: State) => state.savedResolution
)

export const selectIsLoading = createSelector(
  selectResolutionState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectResolutionState,
  (state: State) => state.error
)
