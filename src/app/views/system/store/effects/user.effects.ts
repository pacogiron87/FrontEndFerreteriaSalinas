import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/user.actions';

import {AuthRepository} from "src/app/views/auth/services/auth.repository";
import {NotificationService} from "src/app/core/helpers/notification.service";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authRepository: AuthRepository,
    private notificationService: NotificationService,
  ) {
  }

  authenticateUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.authenticate),
      mergeMap(
        props => this.authRepository.authenticate(props.userName, props.password)
          .pipe(
            map(res => actions.authenticateSuccess({authenticatedUser: res})),
            catchError(err => {
              this.notificationService.warning('Las credenciales ingresadas son inválidas');
              return of(actions.authenticateFails({fails: err}));
            })
          )
      )
    )
  )
}
