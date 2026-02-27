import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/resolution.actions';

import {Resolution} from "src/app/views/income/models/resolution.model";


export const resolutionFeatureKey = 'resolutions';

export interface State {
  resolutions: Resolution[];
  savedResolution: Resolution;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  resolutions: [],
  // @ts-ignore
  savedResolution: null,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getAllResolutions, state => ({...state, isLoading: true})),
  on(actions.getResolutionSuccess, (state, {resolutions}) => ({...state, resolutions, isLoading: false})),
  on(actions.createResolution, state => ({...state, isLoading: true})),
  on(actions.updateResolution, state => ({...state, isLoading: true})),
  on(actions.updateResolutionSuccess, (state, {savedResolution}) => ({...state, savedResolution, isLoading: false})),
  on(actions.updateResolutions, (state, {resolutions}) => ({...state, resolutions})),
  on(actions.resolutionFails, (state, {error}) => ({...state, isLoading: false, error})),
)
