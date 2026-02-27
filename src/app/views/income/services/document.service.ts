import {Injectable} from "@angular/core";


import {Store} from "@ngrx/store";

import * as actions from '../store/actions/document.actions';
import * as selectors from '../store/selectors/document.selectors';
import {State} from "../store/reducers/document.reducer";

import {Document} from "../models/document.model";
import {Observable} from "rxjs";
import { DocumentParameter } from "../models/document-parameter.model";
import { DocumentDTE } from "../models/document-dte.model";


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(
    private store: Store<State>
  ) {
  }

  validateDocument(document: Document): void {
    this.store.dispatch(actions.validateDocument({document}));
  }

  saveDocument(document: Document): void {
    this.store.dispatch(actions.saveDocumentGenerated({document}));
  }

  cancelDocument(document: Document): void {
    this.store.dispatch(actions.cancelDocument({document}));
  }

  selectValidateDocument(): Observable<Document> {
    return this.store.select(selectors.selectValidateDocument);
  }

  selectSavedDocument(): Observable<Document> {
    return this.store.select(selectors.selectSavedDocument);
  }

  selectCancelledDocument(): Observable<Document> {
    return this.store.select(selectors.selectCancelledDocument);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

  cancelDocumentDte(documentParametersDTE: DocumentParameter): void {
    this.store.dispatch(actions.cancelDocumentDte({documentParametersDTE}));
  }

  selectCancelledDocumentDte(): Observable<DocumentDTE> {
    return this.store.select(selectors.selectCancelledDocumentDte);
  }

}
