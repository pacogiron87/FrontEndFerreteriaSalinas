import {createFeatureSelector, createSelector} from "@ngrx/store";

import {municipalityFeatureKey, State} from "../reducers/municipality.reducer";


const selectMunicipalityState = createFeatureSelector<State>(municipalityFeatureKey);

export const selectMunicipalities = createSelector(
  selectMunicipalityState,
  (state: State) => state.municipalities
)

export const selectIsLoading = createSelector(
  selectMunicipalityState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectMunicipalityState,
  (state: State) => state.error
)
