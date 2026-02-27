import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/product.actions';

import {Product} from "src/app/views/expenses/models/product.model";


export const productFeatureKey = 'products';

export interface State {
  products: Product[];
  savedProduct: Product;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  products: [],
  // @ts-ignore
  savedProduct: null,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  initialState,
  on(actions.getAllProducts, state => ({...state, isLoading: true})),
  on(actions.getProducts, state => ({...state, isLoading: true})),
  on(actions.getProductsSuccess, (state, {products}) => ({...state, products, isLoading: false})),
  on(actions.createProduct, state => ({...state, isLoading: true})),
  on(actions.updateProduct, state => ({...state, isLoading: true})),
  on(actions.updateProducts, (state, {products}) => ({...state, products})),
  on(actions.updateProductSuccess, (state, {savedProduct}) => ({...state, savedProduct, isLoading: false})),
  on(actions.changeStatusProduct, state => ({...state, isLoading: true})),
  on(actions.productFails, (state, {error}) => ({...state, isLoading: false, error})),
)
