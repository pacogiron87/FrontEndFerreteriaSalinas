import {createFeatureSelector, createSelector} from "@ngrx/store";

import {State, userFeatureKey} from "../reducers/user.reducer";


const selectUsersState = createFeatureSelector<State>(userFeatureKey);

export const selectAuthenticatedUser = createSelector(
  selectUsersState,
  (state: State) => state.authenticatedUser
)

export const selectAuthenticateFails = createSelector(
  selectUsersState,
  (state: State) => state.fails
)
