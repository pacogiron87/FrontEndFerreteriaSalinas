import {createReducer, on} from "@ngrx/store";

import * as actions from '../actions/category.actions';

import {Category} from "src/app/views/expenses/models/category.model";


export const categoryFeatureKey = 'categories';

export interface State {
  categories: Category[];
  savedCategory: Category;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  categories: [],
  // @ts-ignore
  savedCategory: null,
  isLoading: false,
  error: null
}

export const reducer = createReducer(
  initialState,
  on(actions.getAllCategories, state => ({...state, isLoading: true})),
  on(actions.getCategories, state => ({...state, isLoading: true})),
  on(actions.getCategoriesSuccess, (state, {categories}) => ({...state, categories, isLoading: false})),
  on(actions.createCategory, state => ({...state, isLoading: true})),
  on(actions.updateCategory, state => ({...state, isLoading: true})),
  on(actions.updateCategorySuccess, (state, {savedCategory}) => ({...state, savedCategory, isLoading: false})),
  on(actions.updateCategories, (state, {categories}) => ({...state, categories})),
  on(actions.changeStatusCategory, state => ({...state, isLoading: true})),
  on(actions.categoryFails, (state, {error}) => ({...state, isLoading: false, error})),
)
