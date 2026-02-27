import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/location.actions';

import {environment} from "src/environments/environment";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {ApiService} from "src/app/core/services/api.service";
import {Api} from "src/app/core/enums/api.enum";

import {Location} from 'src/app/views/expenses/models/location.model';

@Injectable()
export class LocationEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getAllLocations$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getAllLocations),
      mergeMap(
        () => this.apiService.getAll<Location[]>(environment.urlApi, Api.GetAllLocations)
          .pipe(
            // @ts-ignore
            map(res => actions.getLocationsSuccess({locations: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las localidades');
              return of(actions.locationFails({error: err}));
            })
          )
      )
    )
  )

  getLocations$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getLocations),
      mergeMap(
        () => this.apiService.getAll<Location[]>(environment.urlApi, Api.GetActiveLocations)
          .pipe(
            // @ts-ignore
            map(res => actions.getLocationsSuccess({locations: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener las localidades');
              return of(actions.locationFails({error: err}));
            })
          )
      )
    )
  )

  createLocation$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.createLocation),
      mergeMap(
        props => this.apiService.create<Location>(props.location, environment.urlApi, Api.CreateLocation)
          .pipe(
            map(res => {
              this.notificationService.success('Se creó la localidad correctamente');
              // @ts-ignore
              return actions.updateLocationSuccess({savedLocation: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al crear la localidad');
              return of(actions.locationFails({error: err}));
            })
          )
      )
    )
  )

  updateLocation$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateLocation),
      mergeMap(
        props => this.apiService.update<Location>(props.location, environment.urlApi, Api.UpdateLocation)
          .pipe(
            map(res => {
              this.notificationService.success('Se editó la localidad correctamente');
              // @ts-ignore
              return actions.updateLocationSuccess({savedLocation: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al editar la localidad');
              return of(actions.locationFails({error: err}));
            })
          )
      )
    )
  )

  changeStatusLocation$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.changeStatusLocation),
      mergeMap(
        props => this.apiService.update<Location>(props, environment.urlApi, Api.ChangeStatusLocation)
          .pipe(
            map(res => {
              this.notificationService.success('Se cambió el estado de la localidad correctamente');
              // @ts-ignore
              return actions.updateLocationSuccess({savedLocation: res.body});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cambiar el estado de la localidad');
              return of(actions.locationFails({error: err}));
            })
          )
      )
    )
  )

}
