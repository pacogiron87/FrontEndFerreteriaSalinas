import {createAction, props} from "@ngrx/store";

import {User} from "src/app/views/system/models/user.model";


export const authenticate = createAction(
  '[Users] Authenticate user',
  props<{ userName: string, password: string }>()
)

export const authenticateSuccess = createAction(
  '[Users] Authenticate user success',
  props<{ authenticatedUser: User }>()
)

export const authenticateFails = createAction(
  '[Users] Authenticate user fails',
  props<{ fails: any }>()
)
