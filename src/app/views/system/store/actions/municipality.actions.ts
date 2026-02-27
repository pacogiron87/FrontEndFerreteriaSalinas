import {createAction, props} from "@ngrx/store";

import {Municipality} from "src/app/views/system/models/municipality.model";



export const getMunicipalities = createAction(
  '[Municipalities] Get all municipalities'
)

export const getMunicipalitiesSuccess = createAction(
  '[Municipalities] Get all municipalities success',
  props<{ municipalities: Municipality[] }>()
)

export const municipalitiesFails = createAction(
  '[Municipalities] Municipalities fails',
  props<{ error: any }>()
)
