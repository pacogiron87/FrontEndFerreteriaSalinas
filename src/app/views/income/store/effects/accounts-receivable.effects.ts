import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from "../actions/accounts-receivable.actions";

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {Payment} from "src/app/views/income/models/payment.model";
import {Sale} from "src/app/views/income/models/sale.model";


@Injectable()
export class AccountsReceivableEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  searchPendingPayments$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.searchPendingPayments),
      mergeMap(
        props => this.apiService.getByParams<Sale[]>(props, environment.urlApi, Api.SearchPendingPayments)
          .pipe(
            // @ts-ignore
            map(res => actions.searchPendingPaymentsSuccess({pendingSales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas pendientes de pago');
              return of((actions.pendingPaymentFails({error: err})));
            })
          )
      )
    )
  )

  addPayment$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addPayment),
      mergeMap(
        props => this.apiService.create<Payment>(props.payment, environment.urlApi, Api.AddPayPendingPayments)
          .pipe(
            map(res => {
              this.notificationService.success(props.payment.idCustomer === 0 ? 'Se realizó el abono a la venta correctamente' : 'Se realizó el abono al cliente correctamente');
              // @ts-ignore
              return actions.addPaySuccess({payment: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrión un error al realizar el abono');
              return of(actions.pendingPaymentFails({error: err}));
            })
          )
      )
    )
  )
}
