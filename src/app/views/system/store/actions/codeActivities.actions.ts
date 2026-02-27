import {createAction, props} from "@ngrx/store";

import {CodeActivities} from "src/app/views/system/models/codeActivities.model";



export const getCodeActivities = createAction(
  '[CodeActivities] Get all codeActivities'
)

export const getCodeActivitiesSuccess = createAction(
  '[CodeActivities] Get all codeActivities success',
  props<{ codeActivities: CodeActivities[] }>()
)

export const codeActivitiesFails = createAction(
  '[CodeActivities] CodeActivities fails',
  props<{ error: any }>()
)
