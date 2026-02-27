import {createReducer, on} from "@ngrx/store";

import * as actions from "../actions/sale.actions";

import {Sale} from "src/app/views/income/models/sale.model";


export const saleFeatureKey = 'sales';

export interface State {
  sales: Sale[];
  foundSales: Sale[];
  salesByCustomer: Sale[];
  addedSale: Sale;
  isLoading: boolean;
  error: any;
  emailSent: boolean;
}

export const initialState: State = {
  sales: [],
  foundSales: [],
  salesByCustomer: [],
  // @ts-ignore
  addedSale: null,
  isLoading: false,
  error: null,
  emailSent: false,
}

export const reducer = createReducer(
  initialState,
  on(actions.getAllSales, state => ({...state, isLoading: true})),
  on(actions.searchSales, state => ({...state, isLoading: true})),
  on(actions.searchSalesByCustomer, state => ({...state, isLoading: true})),
  on(actions.getSalesSuccess, (state, {sales}) => ({...state, sales, isLoading: false})),
  on(actions.getFoundSalesSuccess, (state, {foundSales}) => ({...state, foundSales, isLoading: false})),
  on(actions.getSalesByCustomerSuccess, (state, {salesByCustomer}) => ({...state, salesByCustomer, isLoading: false})),
  on(actions.addSale, state => ({...state, isLoading: true})),
  on(actions.paySale, state => ({...state, isLoading: true})),
  on(actions.updateSales, (state, {sales}) => ({...state, sales})),
  on(actions.addSaleSuccess, (state, {addedSale}) => ({...state, addedSale, isLoading: false})),
  on(actions.paySaleSuccess, (state, {addedSale}) => ({...state, addedSale, isLoading: true})),
  on(actions.saleFails, (state, {error}) => ({...state, isLoading: false, error})),
  on(actions.addSaleInvoiceDte, state => ({...state, isLoading: true})),
  on(actions.addSaleInvoiceSuccessDte, (state, {addedSale}) => ({...state, addedSale, isLoading: true})),
  on(actions.addSaleTaxCreditDte, state => ({...state, isLoading: true})),
  on(actions.addSaleTaxCreditSuccessDte, (state, {addedSale}) => ({...state, addedSale, isLoading: true})),
  on(actions.addSendEmailDte, state => ({...state, isLoading: true})),
  on(actions.addSendEmailDteSuccess, (state, {emailSent}) => ({...state, emailSent, isLoading: false})),
)
