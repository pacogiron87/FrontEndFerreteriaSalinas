import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from "../actions/purchase.actions";

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {Method} from "src/app/core/enums/method.enum";
import {Purchase} from "src/app/views/expenses/models/purchase.model";
import {TypeParam} from "src/app/core/enums/type-param.enum";


@Injectable()
export class PurchaseEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  searchPurchases$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.searchPurchases),
      mergeMap(
        props => this.apiService.getByParams<Purchase[]>(props, environment.urlApi, Api.SearchPurchases, Method.POST, TypeParam.JSON)
          .pipe(
            // @ts-ignore
            map(res => actions.getFoundPurchasesSuccess({foundPurchases: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las compras');
              return of(actions.purchaseFails({error: err}));
            })
          )
      )
    )
  )

  addPurchase$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addPurchase),
      mergeMap(
        props => this.apiService.create<Purchase>(props.purchase, environment.urlApi, Api.AddPurchase)
          .pipe(
            map(res => {
              this.notificationService.success('Se agregó la compra correctamente');
              // @ts-ignore
              return actions.addPurchaseSuccess({addedPurchase: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al agregar la compra');
              return of(actions.purchaseFails({error: err}));
            })
          )
      )
    )
  )
}
