import {createReducer, on} from "@ngrx/store";

import * as actions from "../actions/layout.actions";


export const layoutFeatureKey = 'layout';

export interface State {
  error: any;
}

export const initialState: State = {
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.onError, (state, {error}) => ({...state, error})),
)
