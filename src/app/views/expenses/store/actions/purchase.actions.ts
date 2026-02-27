import {createAction, props} from "@ngrx/store";

import {Purchase} from "src/app/views/expenses/models/purchase.model";


export const searchPurchases = createAction(
  '[Purchases] Search purchases',
  props<{ customerName: string, startDate: string, endDate: string, categoriesId: number[], location:number,}>()
)

export const getFoundPurchasesSuccess = createAction(
  '[Purchases] Get found purchases success',
  props<{ foundPurchases: Purchase[] }>()
)

export const addPurchase = createAction(
  '[Purchases] Add purchase',
  props<{ purchase: Purchase }>()
)

export const updatePurchases = createAction(
  '[Purchases] Update purchases',
  props<{ purchases: Purchase[] }>()
)

export const addPurchaseSuccess = createAction(
  '[Purchases] Add purchase success',
  props<{ addedPurchase: Purchase }>()
)

export const purchaseFails = createAction(
  '[Purchases] Purchase fails',
  props<{ error: any }>()
)
