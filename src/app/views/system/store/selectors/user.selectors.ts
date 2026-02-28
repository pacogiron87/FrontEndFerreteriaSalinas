import { createSelector } from '@ngrx/store';
import { State } from '../reducers/user.reducer';
import { AppState } from '../../../../app.reducer';

export const selectUserState = (state: AppState) => state.users; // users es la clave en AppState

export const selectAuthenticatedUser = createSelector(
  selectUserState,
  (state: State) => state.user
);

export const selectAuthenticateFails = createSelector(
  selectUserState,
  (state: State) => state.error
);

export const selectUsers = createSelector(
  selectUserState,
  (state: State) => state.users || []
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state: State) => state.isLoading || false
);
