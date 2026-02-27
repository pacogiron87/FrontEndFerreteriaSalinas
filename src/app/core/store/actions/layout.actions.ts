import {createAction, props} from "@ngrx/store";


export const onError = createAction(
  '[Layout] OnError',
  props<{ error: any }>()
)

export const closeSession = createAction(
  '[Layout] Close session'
)
