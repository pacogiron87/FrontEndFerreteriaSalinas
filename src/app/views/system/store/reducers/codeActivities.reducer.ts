import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/codeActivities.actions';

import {CodeActivities} from "src/app/views/system/models/codeActivities.model";


export const codeActivitiesFeatureKey = 'codeActivities';

export interface State {
  codeActivities: CodeActivities[];
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  codeActivities: [],
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getCodeActivities, state => ({...state, isLoading: true})),
  on(actions.getCodeActivitiesSuccess, (state, {codeActivities}) => ({...state, codeActivities, isLoading: false})),
  on(actions.codeActivitiesFails, (state, {error}) => ({...state, error, isLoading: false})),
)
