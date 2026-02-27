import {createAction, props} from "@ngrx/store";

import {Resolution} from "src/app/views/income/models/resolution.model";


export const getAllResolutions = createAction(
  '[Resolutions] Get all resolutions'
)

export const getResolutionSuccess = createAction(
  '[Resolutions] Get resolutions success',
  props<{ resolutions: Resolution[] }>()
)

export const createResolution = createAction(
  '[Resolutions] Create resolution',
  props<{ resolution: Resolution }>()
)

export const updateResolution = createAction(
  '[Resolutions] Update resolution',
  props<{ resolution: Resolution }>()
)

export const updateResolutions = createAction(
  '[Resolutions] Update resolutions',
  props<{ resolutions: Resolution[] }>()
)

export const updateResolutionSuccess = createAction(
  '[Resolutions] Update resolution success',
  props<{ savedResolution: Resolution }>()
)

export const resolutionFails = createAction(
  '[Resolutions] Resolution fails',
  props<{ error: any }>()
)
