import {createAction, props} from "@ngrx/store";

import {Location} from "src/app/views/expenses/models/location.model";


export const getAllLocations = createAction(
  '[Locations] Get all locations'
)

export const getLocations = createAction(
  '[Locations] Get locations'
)

export const getLocationsSuccess = createAction(
  '[Locations] Get locations success',
  props<{ locations: Location[] }>()
)

export const createLocation = createAction(
  '[Locations] Create location',
  props<{ location: Location }>()
)

export const updateLocation = createAction(
  '[Locations] Update location',
  props<{ location: Location }>()
)

export const updateLocations = createAction(
  '[Locations] Update locations',
  props<{ locations: Location[] }>()
)

export const updateLocationSuccess = createAction(
  '[Locations] Update location success',
  props<{ savedLocation: Location }>()
)

export const changeStatusLocation = createAction(
  '[Locations] Change status location',
  props<{ id: number, active: boolean, }>()
)

export const locationFails = createAction(
  '[Locations] Locations fails',
  props<{ error: any }>()
)
