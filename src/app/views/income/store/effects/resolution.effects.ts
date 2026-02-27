import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/resolution.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";
import {Api} from "src/app/core/enums/api.enum";

import {Resolution} from "src/app/views/income/models/resolution.model";


@Injectable()
export class ResolutionEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getAllResolutions$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getAllResolutions),
      mergeMap(
        () => this.apiService.getAll<Resolution[]>(environment.urlApi, Api.GetAllResolutions)
          .pipe(
            // @ts-ignore
            map(res => actions.getResolutionSuccess({resolutions: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las resoluciones');
              return of(actions.resolutionFails({error: err}));
            })
          )
      )
    )
  )

  createResolution$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.createResolution),
      mergeMap(
        props => this.apiService.create<Resolution>(props.resolution, environment.urlApi, Api.CreateResolution)
          .pipe(
            map(res => {
              this.notificationService.success('Se creó la resolución correctamente');
              // @ts-ignore
              return actions.updateResolutionSuccess({savedResolution: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al crear la resolución');
              return of(actions.resolutionFails({error: err}));
            })
          )
      )
    )
  )

  updateResolution$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateResolution),
      mergeMap(
        props => this.apiService.update<Resolution>(props.resolution, environment.urlApi, Api.UpdateResolution)
          .pipe(
            map(res => {
              this.notificationService.success('Se editó la resolución correctamente');
              // @ts-ignore
              return actions.updateResolutionSuccess({savedResolution: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al editar la resolución');
              return of(actions.resolutionFails({error: err}));
            })
          )
      )
    )
  )

}
