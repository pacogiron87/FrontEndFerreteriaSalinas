import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/location.actions';

import {Location} from "src/app/views/expenses/models/location.model";


export const locationFeatureKey = 'locations';

export interface State {
  locations: Location[];
  savedLocation: Location;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  locations: [],
  // @ts-ignore
  savedLocation: null,
  isLoading: false,
  error: null
}

export const reducer = createReducer(
  initialState,
  on(actions.getAllLocations, state => ({...state, isLoading: true})),
  on(actions.getLocations, state => ({...state, isLoading: true})),
  on(actions.getLocationsSuccess, (state, {locations}) => ({...state, locations, isLoading: false})),
  on(actions.createLocation, state => ({...state, isLoading: true})),
  on(actions.updateLocation, state => ({...state, isLoading: true})),
  on(actions.updateLocationSuccess, (state, {savedLocation}) => ({...state, savedLocation, isLoading: false})),
  on(actions.updateLocations, (state, {locations}) => ({...state, locations})),
  on(actions.changeStatusLocation, state => ({...state, isLoading: true})),
  on(actions.locationFails, (state, {error}) => ({...state, isLoading: false, error})),
)
