import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/municipality.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {Municipality} from "src/app/views/system/models/municipality.model";


@Injectable()
export class MunicipalityEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  getMunicipalities$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getMunicipalities),
      mergeMap(
        () => this.apiService.getAll<Municipality[]>('', Api.GetMunicipalities)
          .pipe(
            // @ts-ignore
            map(res => actions.getMunicipalitiesSuccess({municipalities: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los clientes');
              return of(actions.municipalitiesFails({error: err}))
            })
          )
      )
    )
  )
}
