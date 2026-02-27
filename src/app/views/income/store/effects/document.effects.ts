import {Injectable} from "@angular/core";
import {catchError, map, mergeMap, of} from "rxjs";

import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as actions from '../actions/document.actions';

import {environment} from "src/environments/environment";

import {ApiService} from "src/app/core/services/api.service";
import {NotificationService} from "src/app/core/helpers/notification.service";

import {Api} from "src/app/core/enums/api.enum";
import {Document} from "src/app/views/income/models/document.model";
import {Response} from "src/app/views/shared/models/response.model";
import { DocumentDTE } from "../../models/document-dte.model";


@Injectable()
export class DocumentEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
  }

  validateDocument$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.validateDocument),
      mergeMap(
        props => this.apiService.create<boolean>(props.document, environment.urlApi, Api.ValidateDocument)
          .pipe(
            map(res => {
              if (res.body) {
                this.notificationService.success('El número de factura es válido');
              } else {
                this.notificationService.error('El número de factura es inválido');
              }
              const document = props.document;
              // @ts-ignore
              document.is_valid_document = res.body;
              return actions.validateDocumentSuccess({validDocument: document});
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al validar la factura');
              return of(actions.documentFails({error: err}));
            })
          )
      )
    )
  )

  saveDocument$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.saveDocumentGenerated),
      mergeMap(
        props => this.apiService.create<Response<Document>>(props.document, environment.urlApi, Api.DocumentGenerated)
          .pipe(
            map(res => {
              if (res.body?.isSuccess) {
                this.notificationService.success('Se guardo el número de factura correctamente');
                return actions.saveDocumentGeneratedSuccess({savedDocument: res.body.data});
              } else {
                this.notificationService.error('Ocurrió un error al guardar el número de factura');
                return actions.documentFails({error: res.body?.returnMessage});
              }
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al guardar el número de factura');
              return of(actions.documentFails({error: err}));
            })
          )
      )
    )
  )

  cancelDocument = createEffect(
    () => this.actions$.pipe(
      ofType(actions.cancelDocument),
      mergeMap(
        props => this.apiService.create<boolean>(props.document, environment.urlApi, Api.CancelDocument)
          .pipe(
            map(res => {
              if (res.body) {
                this.notificationService.success('Se canceló la factura correctamente');
                const document = props.document;
                // @ts-ignore
                document.is_canceled = res.body;
                return actions.cancelDocumentSuccess({cancelledDocument: document});
              } else {
                this.notificationService.error('Ocurrió un error al cancelar la factura');
                return actions.documentFails({error: res.body});
              }
            }),
            catchError(err => {
              this.notificationService.error('Ocurrió un error al cancelar la factura');
              return of(actions.documentFails({error: err}));
            })
          )
      )
    )
  )

  cancelDocumentDte = createEffect(
    () => this.actions$.pipe(
      ofType(actions.cancelDocumentDte),
      mergeMap(
        props => this.apiService.create<Response<DocumentDTE>>(props.documentParametersDTE, environment.urlApi, Api.CancelDocumentDte)
          .pipe(
            map(res => {
              if (res.body?.isSuccess) {
                this.notificationService.success(res.body?.returnMessage ?? 'Se canceló la factura correctamente');
                return actions.cancelDocumentDteSuccess({cancelledDocumentDTE: res.body.data});
              } else {
                this.notificationService.error(res.body?.returnMessage ?? 'Ocurrió un error al cancelar la factura');
                return actions.documentFails({error: res.body?.returnMessage});
              }
            }),
            catchError(err => {
              this.notificationService.error(err.error?.returnMessage ?? 'Ocurrió un error al cancelar la factura');
              return of(actions.documentFails({error: err}));
            })
          )
      )
    )
  )
}
