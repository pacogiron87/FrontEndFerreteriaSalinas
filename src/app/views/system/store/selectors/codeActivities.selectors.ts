import {createFeatureSelector, createSelector} from "@ngrx/store";

import {codeActivitiesFeatureKey, State} from "../reducers/codeActivities.reducer";


const selectCodeActivitiesState = createFeatureSelector<State>(codeActivitiesFeatureKey);
export const selectCodeActivities = createSelector(
  selectCodeActivitiesState,
  (state: State) => state.codeActivities
)

export const selectIsLoading = createSelector(
  selectCodeActivitiesState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectCodeActivitiesState,
  (state: State) => state.error
)
