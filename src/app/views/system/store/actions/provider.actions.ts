import {createAction, props} from "@ngrx/store";

import {Provider} from "src/app/views/system/models/provider.model";


export const getAllProviders = createAction(
  '[Providers] Get all providers'
)

export const getProviders = createAction(
  '[Providers] Get providers'
)

export const getProvidersSuccess = createAction(
  '[Providers] Get providers success',
  props<{ providers: Provider[] }>()
)

export const createProvider = createAction(
  '[Providers] Create provider',
  props<{ provider: Provider }>()
)

export const updateProvider = createAction(
  '[Providers] Update provider',
  props<{ provider: Provider }>()
)

export const updateProviders = createAction(
  '[Providers] Update providers',
  props<{ providers: Provider[] }>()
)

export const updateProviderSuccess = createAction(
  '[Providers] Update provider success',
  props<{ savedProvider: Provider }>()
)

export const changeStatusProvider = createAction(
  '[Providers] Change status provider',
  props<{ id: number, active: boolean }>()
)

export const providerFails = createAction(
  '[Providers] Providers fails',
  props<{ error: any }>()
)
