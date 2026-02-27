import {createAction, props} from "@ngrx/store";

import {Category} from "src/app/views/expenses/models/category.model";


export const getAllCategories = createAction(
  '[Categories] Get all categories'
)

export const getCategories = createAction(
  '[Categories] Get active categories'
)

export const getCategoriesSuccess = createAction(
  '[Categories] Get categories success',
  props<{ categories: Category[] }>()
)

export const createCategory = createAction(
  '[Categories] Create category',
  props<{ category: Category }>()
)

export const updateCategory = createAction(
  '[Categories] Update category',
  props<{ category: Category }>()
)

export const updateCategories = createAction(
  '[Categories] Update categories',
  props<{ categories: Category[] }>()
)

export const updateCategorySuccess = createAction(
  '[Categories] Update category success',
  props<{ savedCategory: Category }>()
)

export const changeStatusCategory = createAction(
  '[Categories] Change status category',
  props<{ id: number, active: boolean, }>()
)

export const categoryFails = createAction(
  '[Categories] Categories fails',
  props<{ error: any }>()
)
