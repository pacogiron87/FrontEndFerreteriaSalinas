import {createFeatureSelector, createSelector} from "@ngrx/store";

import {locationFeatureKey, State} from "../reducers/location.reducer";


const selectLocationsState = createFeatureSelector<State>(locationFeatureKey);

export const selectLocations = createSelector(
  selectLocationsState,
  (state: State) => state.locations
)

export const selectSavedLocation = createSelector(
  selectLocationsState,
  (state: State) => state.savedLocation
)

export const selectIsLoading = createSelector(
  selectLocationsState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectLocationsState,
  (state: State) => state.error
)
