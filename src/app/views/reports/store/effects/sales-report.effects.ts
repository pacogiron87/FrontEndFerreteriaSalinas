import {Injectable} from "@angular/core";

import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, of} from "rxjs";

import * as actions from '../actions/sales.actions';

import {environment} from "src/environments/environment";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {ApiService} from "src/app/core/services/api.service";
import {Api} from "src/app/core/enums/api.enum";
import {Method} from "src/app/core/enums/method.enum";
import {TypeParam} from "src/app/core/enums/type-param.enum";

import {Bill} from "src/app/views/income/models/bill.model";


@Injectable()
export class SaleReportEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getSales$ = createEffect(
    // @ts-ignore
    () => this.actions$.pipe(
      ofType(actions.getSales),
      mergeMap(
        props => this.apiService.getByParams<Bill[]>(props, environment.urlApi, Api.GetMigratedSales, Method.POST, TypeParam.JSON)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesSuccess({sales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas migradas');
              return of(actions.salesReportFails({error: err}));
            })
          )
      )
    )
  )

}
