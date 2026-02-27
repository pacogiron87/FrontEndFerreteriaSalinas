import {createFeatureSelector, createSelector} from "@ngrx/store";

import {outputFeatureKey, State} from "../reducers/output.reducer";


const selectOutputsState = createFeatureSelector<State>(outputFeatureKey);

export const selectFoundOutputs = createSelector(
  selectOutputsState,
  (state: State) => state.outputs
)

export const selectSavedOutput = createSelector(
  selectOutputsState,
  (state: State) => state.savedOutput
)

export const selectChangeStatus = createSelector(
  selectOutputsState,
  (state: State) => state.changedStatusOutput
)

export const selectLoading = createSelector(
  selectOutputsState,
  (state: State) => state.loading
)

export const selectError = createSelector(
  selectOutputsState,
  (state: State) => state.error
)
