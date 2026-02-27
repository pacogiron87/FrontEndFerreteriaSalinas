import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/provider.actions';

import {environment} from "src/environments/environment";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {ApiService} from "src/app/core/services/api.service";
import {Api} from "src/app/core/enums/api.enum";

import {Provider} from "src/app/views/system/models/provider.model";


@Injectable()
export class ProviderEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getAllProviders$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getAllProviders),
      mergeMap(
        () => this.apiService.getAll<Provider[]>(environment.urlApi, Api.GetAllProviders)
          .pipe(
            // @ts-ignore
            map(res => actions.getProvidersSuccess({providers: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los proveedores');
              return of(actions.providerFails({error: err}));
            })
          )
      )
    )
  )

  getProviders$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getProviders),
      mergeMap(
        () => this.apiService.getAll<Provider[]>(environment.urlApi, Api.GetActiveProviders)
          .pipe(
            // @ts-ignore
            map(res => actions.getProvidersSuccess({providers: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los proveedores');
              return of(actions.providerFails({error: err}));
            })
          )
      )
    )
  )

  createProvider$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.createProvider),
      mergeMap(
        props => this.apiService.create<Provider>(props.provider, environment.urlApi, Api.CreateProvider)
          .pipe(
            map(res => {
              this.notificationService.success('Se creó el proveedor correctamente');
              // @ts-ignore
              return actions.updateProviderSuccess({savedProvider: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al crear el proveedor');
              return of(actions.providerFails({error: err}));
            })
          )
      )
    )
  )

  updateProvider$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateProvider),
      mergeMap(
        props => this.apiService.update<Provider>(props.provider, environment.urlApi, Api.UpdateProvider)
          .pipe(
            map(res => {
              this.notificationService.success('Se editó el proveedor correctamente');
              // @ts-ignore
              return actions.updateProviderSuccess({savedProvider: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al editar el proveedor');
              return of(actions.providerFails({error: err}));
            })
          )
      )
    )
  )

  changeStatusProvider$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.changeStatusProvider),
      mergeMap(
        props => this.apiService.update<Provider>(props, environment.urlApi, Api.ChangeStatusProvider)
          .pipe(
            map(res => {
              this.notificationService.success('Se cambió el estado del proveedor correctamente');
              // @ts-ignore
              return actions.updateProviderSuccess({savedProvider: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cambiar el estado del proveedor');
              return of(actions.providerFails({error: err}));
            })
          )
      )
    )
  )

}
