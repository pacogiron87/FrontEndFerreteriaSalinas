import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/sales.actions';

import {Bill} from "src/app/views/income/models/bill.model";


export const saleReportFeatureKey = 'salesReport';

export interface State {
  sales: Bill[];
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  sales: [],
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getSales, state => ({...state, isLoading: true})),
  on(actions.getSalesSuccess, (state, {sales}) => ({...state, sales, isLoading: false})),
  on(actions.salesReportFails, (state, {error}) => ({...state, isLoading: false, error})),
)
