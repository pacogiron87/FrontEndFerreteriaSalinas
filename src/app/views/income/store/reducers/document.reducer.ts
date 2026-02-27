import { createReducer, on } from '@ngrx/store';

import * as actions from '../actions/document.actions';

import { Document } from 'src/app/views/income/models/document.model';
import { DocumentDTE } from '../../models/document-dte.model';

export const documentFeatureKey = 'documents';

export interface State {
  validDocument: Document;
  savedDocument: Document;
  cancelledDocument: Document;
  cancelledDocumentDTE: DocumentDTE;
  isLoading: boolean;
  error: any;
}

export const initialState: State = {
  // @ts-ignore
  validDocument: null,
  // @ts-ignore
  savedDocument: null,
  // @ts-ignore
  cancelledDocument: null,
  // @ts-ignore
  cancelledDocumentDTE: null,
  isLoading: false,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(actions.validateDocument, (state) => ({ ...state, isLoading: true })),
  on(actions.validateDocumentSuccess, (state, { validDocument }) => ({ ...state, validDocument, isLoading: false, })),
  on(actions.saveDocumentGenerated, (state) => ({ ...state, isLoading: true })),
  on(actions.saveDocumentGeneratedSuccess, (state, { savedDocument }) => ({ ...state, savedDocument, isLoading: false, })),
  on(actions.cancelDocument, (state) => ({ ...state, isLoading: true })),
  on(actions.cancelDocumentSuccess, (state, { cancelledDocument }) => ({ ...state, cancelledDocument, isLoading: false, })),
  on(actions.documentFails, (state, { error }) => ({ ...state, isLoading: false, error, })),
  on(actions.cancelDocumentDte, (state) => ({ ...state, isLoading: true })),
  on(actions.cancelDocumentDteSuccess, (state, { cancelledDocumentDTE }) => ({ ...state, cancelledDocumentDTE, isLoading: false, })),
);
