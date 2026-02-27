import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/municipality.actions';

import {Municipality} from "src/app/views/system/models/municipality.model";


export const municipalityFeatureKey = 'municipalities';

export interface State {
  municipalities: Municipality[];
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  municipalities: [],
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getMunicipalities, state => ({...state, isLoading: true})),
  on(actions.getMunicipalitiesSuccess, (state, {municipalities}) => ({...state, municipalities, isLoading: false})),
  on(actions.municipalitiesFails, (state, {error}) => ({...state, error, isLoading: false})),
)
