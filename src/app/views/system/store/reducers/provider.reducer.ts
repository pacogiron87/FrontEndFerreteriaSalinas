import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/provider.actions';

import {Provider} from "src/app/views/system/models/provider.model";


export const providerFeatureKey = 'providers';

export interface State {
  providers: Provider[];
  savedProvider: Provider;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  providers: [],
  // @ts-ignore
  savedProvider: null,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getAllProviders, state => ({...state, isLoading: true})),
  on(actions.getProviders, state => ({...state, isLoading: true})),
  on(actions.getProvidersSuccess, (state, {providers}) => ({...state, providers, isLoading: false})),
  on(actions.createProvider, state => ({...state, isLoading: true})),
  on(actions.updateProvider, state => ({...state, isLoading: true})),
  on(actions.updateProviders, (state, {providers}) => ({...state, providers})),
  on(actions.updateProviderSuccess, (state, {savedProvider}) => ({...state, savedProvider, isLoading: false})),
  on(actions.changeStatusProvider, state => ({...state, isLoading: true})),
  on(actions.providerFails, (state, {error}) => ({...state, isLoading: false, error})),
)
