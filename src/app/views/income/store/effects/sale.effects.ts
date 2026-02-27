import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/sale.actions';
import * as documentActions from '../actions/document.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {Method} from "src/app/core/enums/method.enum";
import {Sale} from "src/app/views/income/models/sale.model";
import {Response} from "src/app/views/shared/models/response.model";
import {TypeParam} from "src/app/core/enums/type-param.enum";


@Injectable()
export class SaleEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getAllSales$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getAllSales),
      mergeMap(
        () => this.apiService.getAll<Sale[]>(environment.urlApi, Api.GetSales)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesSuccess({sales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  searchSales$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.searchSales),
      mergeMap(
        props => this.apiService.getByParams<Sale[]>(props, environment.urlApi, Api.SearchSales, Method.POST, TypeParam.JSON)
          .pipe(
            // @ts-ignore
            map(res => actions.getFoundSalesSuccess({foundSales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  searchSalesByCustomer$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.searchSalesByCustomer),
      mergeMap(
        props => this.apiService.getByParams<Sale[]>(props, environment.urlApi, Api.SearchSalesByCustomer)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesByCustomerSuccess({salesByCustomer: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  addSale$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addSale),
      mergeMap(
        props => this.apiService.create<Sale>(props.sale, environment.urlApi, Api.AddSale)
          .pipe(
            map(res => {
              this.notificationService.success('Se agregó la venta correctamente');
              // @ts-ignore
              return actions.addSaleSuccess({addedSale: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al agregar la venta');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  paySale$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.paySale),
      mergeMap(
        props => this.apiService.create<Sale>(props.sale, environment.urlApi, Api.PaySale)
          .pipe(
            map(res => {
              this.notificationService.success('Se pago la venta correctamente');
              // @ts-ignore
              return actions.paySaleSuccess({addedSale: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al pagar la venta');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  addSaleInvoiceDte$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addSaleInvoiceDte),
      mergeMap(
        props => this.apiService.create<Sale>(props.sale, environment.urlApi, Api.AddSaleInvoiceDte)
          .pipe(
            map(res => {
              this.notificationService.success('Se agregó la venta correctamente');
              // @ts-ignore
              return actions.addSaleInvoiceSuccessDte({addedSale: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al agregar la venta');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  addSaleTaxCreditDte$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addSaleTaxCreditDte),
      mergeMap(
        props => this.apiService.create<Sale>(props.sale, environment.urlApi, Api.AddSaleTaxCreditDte)
          .pipe(
            map(res => {
              this.notificationService.success('Se agregó la venta correctamente');
              // @ts-ignore
              return actions.addSaleTaxCreditSuccessDte({addedSale: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al agregar la venta');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  )

  addSendEmailDte$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addSendEmailDte),
      mergeMap(
        props => this.apiService.create<Response<boolean>>(props.emailParameters, environment.urlApi, Api.SendEmail)
          .pipe(
            map(res => {
              if (res.body?.isSuccess) {
                this.notificationService.success('Se envio la factura exitosamente');
                return actions.addSendEmailDteSuccess({emailSent: true});
              } else {
                this.notificationService.error(`No fue posible enviar la factura: ${res.body?.returnMessage}`);
                return actions.addSendEmailDteSuccess({emailSent: false});
              }
            }),
            catchError(err => {
              this.notificationService.error(`Ocurrió un error al realizar el envio: ${err.error.returnMessage}`);
              console.log(err);
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  );

  refreshAfterAddSaleInvoiceDte$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addSaleInvoiceSuccessDte),
      mergeMap(
        () => this.apiService.getAll<Sale[]>(environment.urlApi, Api.GetSales)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesSuccess({sales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  );

  refreshAfterAddTaxCreditDte$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addSaleTaxCreditSuccessDte),
      mergeMap(
        () => this.apiService.getAll<Sale[]>(environment.urlApi, Api.GetSales)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesSuccess({sales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  );

  refreshAfterAddPaySale$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.paySaleSuccess),
      mergeMap(
        () => this.apiService.getAll<Sale[]>(environment.urlApi, Api.GetSales)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesSuccess({sales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  );

  refreshAfterCancelDocument$ = createEffect(
    () => this.actions$.pipe(
      ofType(documentActions.cancelDocumentDteSuccess),
      mergeMap(
        () => this.apiService.getAll<Sale[]>(environment.urlApi, Api.GetSales)
          .pipe(
            // @ts-ignore
            map(res => actions.getSalesSuccess({sales: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las ventas');
              return of(actions.saleFails({error: err}));
            })
          )
      )
    )
  );
}
