import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from "../actions/customer.actions";

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {Customer} from "src/app/views/system/models/customer.model";


@Injectable()
export class CustomerEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getCustomers$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getCustomers),
      mergeMap(
        () => this.apiService.getAll<Customer[]>(environment.urlApi, Api.GetCustomers)
          .pipe(
            // @ts-ignore
            map(res => actions.getCustomersSuccess({customers: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los clientes');
              return of(actions.customerFails({error: err}))
            })
          )
      )
    )
  )

  createCustomer$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.createCustomer),
      mergeMap(
        props => this.apiService.create<Customer>(props.customer, environment.urlApi, Api.CreateCustomer)
          .pipe(
            map(res => {
              this.notificationService.success('Se creó el cliente correctamente');
              // @ts-ignore
              return actions.updateCustomerSuccess({savedCustomer: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al crear el cliente');
              return of(actions.customerFails({error: err}));
            })
          )
      )
    )
  )

  updateCustomer$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateCustomer),
      mergeMap(
        props => this.apiService.update<Customer>(props.customer, environment.urlApi, Api.UpdateCustomer)
          .pipe(
            map(res => {
              this.notificationService.success('Se editó el cliente correctamente');
              // @ts-ignore
              return actions.updateCustomerSuccess({savedCustomer: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al editar el cliente');
              return of(actions.customerFails({error: err}));
            })
          )
      )
    )
  )

}
