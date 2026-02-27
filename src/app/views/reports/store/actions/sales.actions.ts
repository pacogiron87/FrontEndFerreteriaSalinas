import {createAction, props} from "@ngrx/store";

import {Bill} from "src/app/views/income/models/bill.model";


export const getSales = createAction(
  '[Sales Report] Get sales report',
  props<{ customerName: string, startDate: string, endDate: string,categoryName:string, }>()
)

export const getSalesSuccess = createAction(
  '[Sales Report] Get sales report success',
  props<{ sales: Bill[] }>()
)

export const salesReportFails = createAction(
  '[Sales Report] Sales report fails',
  props<{ error: any }>()
)
