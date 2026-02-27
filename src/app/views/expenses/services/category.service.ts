import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import {State} from "../store/reducers/category.reducer";
import * as actions from '../store/actions/category.actions';
import * as selectors from '../store/selectors/category.selectors';

import {Category} from "../models/category.model";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private store: Store<State>
  ) {
  }

  getAllCategories(): void {
    this.store.dispatch(actions.getAllCategories());
  }

  getCategories(): void {
    this.store.dispatch(actions.getCategories());
  }

  createCategory(category: Category): void {
    this.store.dispatch(actions.createCategory({category}));
  }

  updateCategory(category: Category): void {
    this.store.dispatch(actions.updateCategory({category}));
  }

  updateCategories(categories: Category[]): void {
    this.store.dispatch(actions.updateCategories({categories}));
  }

  changeStatusCategory(id: number, active: boolean): void {
    this.store.dispatch(actions.changeStatusCategory({id, active}));
  }

  selectCategories(): Observable<Category[]> {
    return this.store.select(selectors.selectCategories);
  }

  selectSavedCategory(): Observable<Category> {
    return this.store.select(selectors.selectSavedCategory);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
