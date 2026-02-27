import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/output.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";


import {Api} from "src/app/core/enums/api.enum";
import {Method} from "src/app/core/enums/method.enum";
import {Output} from "src/app/views/expenses/models/output.model";
import {TypeParam} from "src/app/core/enums/type-param.enum";


@Injectable()
export class OutputEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  searchOutputs$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.searchOutputs),
      mergeMap(
        props => this.apiService.getByParams<Output[]>(props, environment.urlApi, Api.GetOutputs, Method.POST, TypeParam.JSON)
          .pipe(
            // @ts-ignore
            map(res => actions.getFoundOutputs({outputs: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las salidas');
              return of(actions.outputFails({error: err}));
            })
          )
      )
    )
  )

  addOutput$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.addOutput),
      mergeMap(
        props => this.apiService.create<Output>(props.output, environment.urlApi, Api.AddOutput)
          .pipe(
            map(res => {
              this.notificationService.success('Se agregó la salida correctamente');
              // @ts-ignore
              return actions.updateOutputSuccess({savedOutput: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al agregar la salida');
              return of(actions.outputFails({error: err}));
            })
          )
      )
    )
  )

  changeStatusOutput$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.changeStatusOutput),
      mergeMap(
        props => this.apiService.create<boolean>(props, environment.urlApi, Api.ChangeOutputStatus, TypeParam.QUERY)
          .pipe(
            map(res => {
              this.notificationService.success('Se cambió el estado de la salida correctamente');
              const output: Output = {
                active: props.status,
                amount_output: 0,
                description: '',
                id: props.id,
                output_receiver: '',
                output_type: '',
              };
              // @ts-ignore
              return actions.changeStatusOutputSuccess({changedStatusOutput: output});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cambiar el estado de la salida');
              return of(actions.outputFails({error: err}));
            })
          )
      )
    )
  )
}
