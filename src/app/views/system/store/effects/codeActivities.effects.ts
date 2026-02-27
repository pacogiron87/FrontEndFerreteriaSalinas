import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/codeActivities.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {CodeActivities} from "src/app/views/system/models/codeActivities.model";


@Injectable()
export class CodeActivitiesEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }
  getCodeActivities$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.getCodeActivities),
      mergeMap(
        () => this.apiService.getAll<CodeActivities[]>('', Api.GetCodeActivities)
          .pipe(
            // @ts-ignore
            map(res => actions.getCodeActivitiesSuccess({codeActivities: res.body})),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al obtener los clientes');
              return of(actions.codeActivitiesFails({error: err}))
            })
          )
      )
    )
  )
}
