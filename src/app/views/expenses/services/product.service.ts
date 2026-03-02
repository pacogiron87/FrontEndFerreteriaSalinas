import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";

import { State } from '../store/reducers/product.reducer';
import * as actions from '../store/actions/product.actions';
import * as selectors from '../store/selectors/product.selectors';

import { Product } from "../models/product.model";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private store: Store<State>,
  ) {
  }

  getAllProducts(): void {
    this.store.dispatch(actions.getAllProducts());
  }

  getProducts(): void {
    this.store.dispatch(actions.getProducts());
  }

  createProduct(product: Product): void {
    // @ts-ignore
    product.category_id = product.category_id.id;
    // @ts-ignore
    product.provider_id = product.provider_id.id;
    // @ts-ignore
    product.location_id = product.location_id.id;
    product.wholesale_price = product.wholesale_price ?? 0;
    product.discount = product.discount ?? 0;
    this.store.dispatch(actions.createProduct({ product }));
  }

  updateProduct(product: Product): void {
    // @ts-ignore
    product.category_id = product.category_id.id;
    // @ts-ignore
    product.provider_id = product.provider_id.id;
    // @ts-ignore
    product.location_id = product.location_id.id;
    this.store.dispatch(actions.updateProduct({ product }));
  }

  updateProducts(products: Product[]): void {
    this.store.dispatch(actions.updateProducts({ products }));
  }

  clearSavedProduct(): void {
    this.store.dispatch(actions.updateProductSuccess({ savedProduct: null as any }));
  }

  changeStatusProduct(id: number, active: boolean): void {
    this.store.dispatch(actions.changeStatusProduct({ id, active }));
  }

  selectProducts(): Observable<Product[]> {
    return this.store.select(selectors.selectProducts);
  }

  selectSavedProduct(): Observable<Product> {
    return this.store.select(selectors.selectSavedProduct);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
