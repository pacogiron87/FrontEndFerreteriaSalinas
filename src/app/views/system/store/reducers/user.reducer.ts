import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/user.actions';

import {User} from "src/app/views/system/models/user.model";


export const userFeatureKey = 'users';

export interface State {
  users: User[];
  savedUser: User;
  authenticatedUser: User;
  isLoading: boolean;
  error: any;
  fails: any;
}

export const initialState: State = {
  users: [],
  // @ts-ignore
  savedUser: null,
  // @ts-ignore
  authenticatedUser: null,
  isLoading: false,
  error: null,
  fails: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.authenticate, state => ({...state, isLoading: true})),
  on(actions.authenticateSuccess, (state, {authenticatedUser}) => ({...state, authenticatedUser, isLoading: false})),
  on(actions.authenticateFails, (state, {fails}) => ({...state, isLoading: false, fails})),
)
