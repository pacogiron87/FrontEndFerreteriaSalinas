import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/transaction.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {EndTransaction} from "src/app/views/system/models/end-transactions.model";
import {Method} from "src/app/core/enums/method.enum";
import {Response} from "src/app/views/shared/models/response.model";
import {Transaction} from "src/app/views/system/models/transaction.model";
import {TypeParam} from "src/app/core/enums/type-param.enum";


@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  searchTransactions$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.searchTransaction),
      mergeMap(
        props => this.apiService.getByParams<Response<Transaction[]>>(props, environment.urlApi, Api.GetBalance, Method.POST, TypeParam.JSON)
          .pipe(
            map(res => {
              if (!res.body?.isSuccess) {
                this.notificationService.warning('Al parecer no tiene operaciones registradas');
                return actions.transactionFails({error: res.body?.returnMessage});
              }
              return actions.getTransactionsSuccess({transactions: res.body.data});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las operaciones');
              return of(actions.transactionFails({error: err}));
            })
          )
      )
    )
  )

  addTransaction = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addTransaction),
      mergeMap(
        props => this.apiService.create<Response<Transaction>>(props.transaction, environment.urlApi, Api.AddBalance)
          .pipe(
            map(res => {
              if (!res.body?.isSuccess) {
                this.notificationService.error(res.body?.returnMessage);
                return actions.transactionFails({error: res.body?.returnMessage});
              }
              this.notificationService.success('Se abrió la caja correctamente');
              const updatedTransaction: Transaction = res.body.data;
              updatedTransaction.status_balance = 'Inicio Caja';
              return actions.updateTransactionSuccess({updatedTransaction});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al abrir la caja');
              return of(actions.transactionFails({error: err}));
            })
          )
      )
    )
  )

  changeTransactionStatus$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.changeTransactionStatus),
      mergeMap(
        props => this.apiService.create<Response<boolean>>(props, environment.urlApi, Api.ChangeBalanceStatus, TypeParam.QUERY)
          .pipe(
            map(res => {
              if (!res.body?.isSuccess) {
                this.notificationService.error('Ocurrió un error al desactivar la caja');
                return actions.transactionFails({error: res.body?.returnMessage});
              }
              this.notificationService.success('Se desactivó la caja correctamente');
              const transaction: Transaction = {
                active: props.status,
                id: props.id,
                input_balance: 0,
                location_id: 0,
                output_balance: 0,
                start_balance: 0,
                start_date: "",
                total_balance: 0,
              };
              return actions.changeTransactionStatusSuccess({changedTransactionStatus: transaction});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al desactivar la caja');
              return of(actions.transactionFails({error: err}));
            })
          )
      )
    )
  )

  startTransaction$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.startTransaction),
      mergeMap(
        props => this.apiService.create<Response<Transaction[]>>(props, environment.urlApi, Api.StartBalanceByLocation, TypeParam.QUERY)
          .pipe(
            map(res => {
              if (!res.body?.isSuccess) {
                this.notificationService.error(res.body?.returnMessage);
                return actions.transactionFails({error: res.body?.returnMessage});
              }
              this.notificationService.success('Se abrió la caja correctamente');
              // @ts-ignore
              return actions.updateTransactionSuccess({updatedTransaction: res.body.data[0]});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al abrir la caja');
              return of(actions.transactionFails({error: err}));
            })
          )
      )
    )
  )

  endTransaction = createEffect(
    () => this.actions$.pipe(
      ofType(actions.endTransaction),
      mergeMap(
        props => this.apiService.create<Response<Transaction[]>>(props.endTransaction, environment.urlApi, Api.EndBalanceByLocation)
          .pipe(
            map(res => {
              if (!res.body?.isSuccess) {
                this.notificationService.error(res.body?.returnMessage);
                const transaction: Transaction = {
                  active: true,
                  end_balance: 0,
                  id: props.endTransaction.id_balance,
                  input_balance: 0,
                  location_id: 0,
                  output_balance: 0,
                  start_balance: 0,
                  start_date: props.endTransaction.start_date,
                  status_balance: 'Inicio Caja',
                  total_balance: 0,
                };
                return actions.getEndedTransactionSuccess({endedTransaction: transaction});
              }
              this.notificationService.success('Se cerró la caja correctamente');
              // @ts-ignore
              return actions.getEndedTransactionSuccess({endedTransaction: res.body?.data[0]});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cerrar la caja');
              return of(actions.transactionFails({error: err}));
            })
          )
      )
    )
  )
}
