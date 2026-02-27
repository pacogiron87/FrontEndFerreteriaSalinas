import {createAction, props} from "@ngrx/store";

import {Product} from "src/app/views/expenses/models/product.model";


export const getAllProducts = createAction(
  '[Products] Get all products'
)

export const getProducts = createAction(
  '[Products] Get products'
)

export const getProductsSuccess = createAction(
  '[Products] Get products success',
  props<{ products: Product[] }>()
)

export const createProduct = createAction(
  '[Products] Create product',
  props<{ product: Product }>()
)

export const updateProduct = createAction(
  '[Products] Update product',
  props<{ product: Product }>()
)

export const updateProducts = createAction(
  '[Products] Update products',
  props<{ products: Product[] }>()
)

export const updateProductSuccess = createAction(
  '[Products] Update product success',
  props<{ savedProduct: Product }>()
)

export const changeStatusProduct = createAction(
  '[Products] Change status product',
  props<{ id: number, active: boolean, }>()
)

export const productFails = createAction(
  '[Products] Products fails',
  props<{ error: any }>()
)
