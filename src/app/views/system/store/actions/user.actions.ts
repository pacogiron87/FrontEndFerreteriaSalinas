import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const authenticate = createAction('[User] Authenticate', props<{ userName: string, password: string }>());
export const authenticateSuccess = createAction('[User] Authenticate Success', props<{ user: User }>());
export const authenticateFails = createAction('[User] Authenticate Fails', props<{ error: any }>());

export const getUsers = createAction('[User] Get Users');
export const getUsersSuccess = createAction('[User] Get Users Success', props<{ users: User[] }>());

export const createUser = createAction('[User] Create User', props<{ user: User }>());
export const updateUser = createAction('[User] Update User', props<{ user: User }>());
export const changeStatusUser = createAction('[User] Change Status User', props<{ id: string, active: boolean }>());
export const saveUserSuccess = createAction('[User] Save User Success', props<{ user: User }>());
