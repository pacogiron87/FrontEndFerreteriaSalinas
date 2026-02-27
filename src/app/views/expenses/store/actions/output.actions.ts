import {createAction, props} from "@ngrx/store";

import {Output} from "src/app/views/expenses/models/output.model";


export const searchOutputs = createAction(
  '[Outputs] Search outputs',
  props<{ startDate: string, endDate: string, location_id: number[] }>()
)

export const getFoundOutputs = createAction(
  '[Outputs] Get found outputs',
  props<{ outputs: Output[] }>()
)

export const addOutput = createAction(
  '[Outputs] Add output',
  props<{ output: Output }>()
)

export const updateOutputs = createAction(
  '[Outputs] Update outputs',
  props<{ outputs: Output[] }>()
)

export const updateOutputSuccess = createAction(
  '[Outputs] Update output success',
  props<{ savedOutput: Output }>()
)

export const changeStatusOutput = createAction(
  '[Outputs] Change status output',
  props<{ id: number, status: boolean, comment: string, userId: number }>()
)

export const changeStatusOutputSuccess = createAction(
  '[Outputs] Change status output success',
  props<{ changedStatusOutput: Output }>()
)

export const outputFails = createAction(
  '[Outputs] Output fails',
  props<{ error: any }>()
)
