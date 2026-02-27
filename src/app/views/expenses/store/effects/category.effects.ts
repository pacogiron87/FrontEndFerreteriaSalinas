import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/category.actions';

import {environment} from "src/environments/environment";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {ApiService} from "src/app/core/services/api.service";
import {Api} from "src/app/core/enums/api.enum";

import {Category} from "src/app/views/expenses/models/category.model";


@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getAllCategories$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getAllCategories),
      mergeMap(
        () => this.apiService.getAll<Category[]>(environment.urlApi, Api.GetAllCategories)
          .pipe(
            // @ts-ignore
            map(res => actions.getCategoriesSuccess({categories: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las categorías');
              return of(actions.categoryFails({error: err}));
            })
          )
      )
    )
  )

  getCategories$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getCategories),
      mergeMap(
        () => this.apiService.getAll<Category[]>(environment.urlApi, Api.GetActiveCategories)
          .pipe(
            // @ts-ignore
            map(res => actions.getCategoriesSuccess({categories: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las categorías');
              return of(actions.categoryFails({error: err}));
            })
          )
      )
    )
  )

  createCategory$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.createCategory),
      mergeMap(
        props => this.apiService.create<Category>(props.category, environment.urlApi, Api.CreateCategory)
          .pipe(
            map(res => {
              this.notificationService.success('Se creó la categoría correctamente');
              // @ts-ignore
              return actions.updateCategorySuccess({savedCategory: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al crear la categoría');
              return of(actions.categoryFails({error: err}));
            })
          )
      )
    )
  )

  updateCategory$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateCategory),
      mergeMap(
        props => this.apiService.update<Category>(props.category, environment.urlApi, Api.UpdateCategory)
          .pipe(
            map(res => {
              this.notificationService.success('Se editó la categoría correctamente');
              // @ts-ignore
              return actions.updateCategorySuccess({savedCategory: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al editar la categoría');
              return of(actions.categoryFails({error: err}));
            })
          )
      )
    )
  )

  changeStatusCategory$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.changeStatusCategory),
      mergeMap(
        props => this.apiService.update<Category>(props, environment.urlApi, Api.ChangeStatusCategory)
          .pipe(
            map(res => {
              this.notificationService.success('Se cambió el estado de la categoría correctamente');
              // @ts-ignore
              return actions.updateCategorySuccess({savedCategory: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cambiar el estado de la categoría');
              return of(actions.categoryFails({error: err}));
            })
          )
      )
    )
  )

}
