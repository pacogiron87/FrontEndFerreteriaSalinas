import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/product.actions';

import {environment} from "src/environments/environment";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {ApiService} from "src/app/core/services/api.service";
import {Api} from "src/app/core/enums/api.enum";

import {Product} from "src/app/views/expenses/models/product.model";


@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getAllProducts$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getAllProducts),
      mergeMap(
        () => this.apiService.getAll<Product[]>(environment.urlApi, Api.GetAllProducts)
          .pipe(
            // @ts-ignore
            map(res => actions.getProductsSuccess({products: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los productos');
              return of(actions.productFails({error: err}));
            })
          )
      )
    )
  )

  getProducts$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getProducts),
      mergeMap(
        () => this.apiService.getAll<Product[]>(environment.urlApi, Api.GetActiveProducts)
          .pipe(
            // @ts-ignore
            map(res => actions.getProductsSuccess({products: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los productos');
              return of(actions.productFails({error: err}));
            })
          )
      )
    )
  )


  createProduct$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.createProduct),
      mergeMap(
        props => this.apiService.create<Product>(props.product, environment.urlApi, Api.CreateProduct)
          .pipe(
            map(res => {
              this.notificationService.success('Se creó el producto correctamente');
              // @ts-ignore
              return actions.updateProductSuccess({savedProduct: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al crear el producto');
              return of(actions.productFails({error: err}));
            })
          )
      )
    )
  )

  updateProduct$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateProduct),
      mergeMap(
        props => this.apiService.update<Product>(props.product, environment.urlApi, Api.UpdateProduct)
          .pipe(
            map(res => {
              this.notificationService.success('Se editó el producto correctamente');
              // @ts-ignore
              return actions.updateProductSuccess({savedProduct: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al editar el producto');
              return of(actions.productFails({error: err}));
            })
          )
      )
    )
  )

  changeStatusProduct$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.changeStatusProduct),
      mergeMap(
        props => this.apiService.update<Product>(props, environment.urlApi, Api.ChangeStatusProduct)
          .pipe(
            map(res => {
              this.notificationService.success('Se cambió el estado del producto correctamente');
              // @ts-ignore
              return actions.updateProductSuccess({savedProduct: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cambiar el estado del producto');
              return of(actions.productFails({error: err}));
            })
          )
      )
    )
  )

}
