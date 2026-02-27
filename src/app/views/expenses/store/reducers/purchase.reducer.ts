import {createReducer, on} from "@ngrx/store";

import * as actions from "../actions/purchase.actions";

import {Purchase} from "src/app/views/expenses/models/purchase.model";


export const purchaseFeatureKey = 'purchases';

export interface State {
  purchases: Purchase[];
  foundPurchases: Purchase[];
  addedPurchase: Purchase;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  purchases: [],
  foundPurchases: [],
  // @ts-ignore
  addedPurchase: undefined,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.searchPurchases, state => ({...state, isLoading: true})),
  on(actions.getFoundPurchasesSuccess, (state, {foundPurchases}) => ({...state, foundPurchases, isLoading: false})),
  on(actions.addPurchase, state => ({...state, isLoading: true})),
  on(actions.updatePurchases, (state, {purchases}) => ({...state, foundPurchases: purchases})),
  on(actions.addPurchaseSuccess, (state, {addedPurchase}) => ({...state, addedPurchase, isLoading: false})),
  on(actions.purchaseFails, (state, {error}) => ({...state, isLoading: false, error})),
)
