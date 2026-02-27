import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/output.actions';

import {Output} from "src/app/views/expenses/models/output.model";


export const outputFeatureKey = 'outputs';

export interface State {
  outputs: Output[];
  savedOutput: Output;
  changedStatusOutput: Output;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  outputs: [],
  // @ts-ignore
  savedOutput: undefined,
  // @ts-ignore
  changedStatusOutput: undefined,
  loading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.searchOutputs, state => ({...state, loading: true})),
  on(actions.getFoundOutputs, (state, {outputs}) => ({...state, outputs, loading: false})),
  on(actions.addOutput, state => ({...state, loading: true})),
  on(actions.updateOutputs, (state, {outputs}) => ({...state, outputs})),
  on(actions.updateOutputSuccess, (state, {savedOutput}) => ({...state, savedOutput, loading: false})),
  on(actions.changeStatusOutput, state => ({...state, loading: true})),
  on(actions.changeStatusOutputSuccess, (state, {changedStatusOutput}) => ({...state, changedStatusOutput, loading: false})),
  on(actions.outputFails, (state, {error}) => ({...state, error, loading: false})),
)
