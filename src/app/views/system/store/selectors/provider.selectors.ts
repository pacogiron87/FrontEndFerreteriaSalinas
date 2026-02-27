import {createFeatureSelector, createSelector} from "@ngrx/store";

import {State, providerFeatureKey} from '../reducers/provider.reducer';


const selectProvidersState = createFeatureSelector<State>(providerFeatureKey);

export const selectProviders = createSelector(
  selectProvidersState,
  (state: State) => state.providers
)

export const selectSavedProvider = createSelector(
  selectProvidersState,
  (state: State) => state.savedProvider
)

export const selectIsLoading = createSelector(
  selectProvidersState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectProvidersState,
  (state: State) => state.error
)
