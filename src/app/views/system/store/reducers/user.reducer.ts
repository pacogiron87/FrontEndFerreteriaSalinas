import {createReducer, on} from "@ngrx/store";
import * as actions from '../actions/user.actions';
import {User} from "src/app/views/system/models/user.model";

export const userFeatureKey = 'users';

export interface State {
  users: User[];
  savedUser: User | null;
  user: User | null; // Sincronizado con authenticateSuccess
  isLoading: boolean;
  error: any; // Sincronizado con authenticateFails
}

export const initialState: State = {
  users: [],
  savedUser: null,
  user: null,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.authenticate, state => ({...state, isLoading: true, error: null})),
  on(actions.authenticateSuccess, (state, {user}) => ({...state, user, isLoading: false, error: null})),
  on(actions.authenticateFails, (state, {error}) => ({...state, isLoading: false, error})),
  
  on(actions.getUsers, state => ({...state, isLoading: true})),
  on(actions.getUsersSuccess, (state, {users}) => ({...state, users, isLoading: false})),
  
  on(actions.saveUserSuccess, (state, {user}) => ({...state, savedUser: user, isLoading: false}))
)
