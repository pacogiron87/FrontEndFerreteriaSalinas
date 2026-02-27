import { createAction, props } from '@ngrx/store';

import { Document } from 'src/app/views/income/models/document.model';
import { DocumentParameter } from '../../models/document-parameter.model';
import { DocumentDTE } from '../../models/document-dte.model';

export const validateDocument = createAction(
  '[Documents] Validate document',
  props<{ document: Document }>()
);

export const validateDocumentSuccess = createAction(
  '[Documents] Validate document success',
  props<{ validDocument: Document }>()
);

export const saveDocumentGenerated = createAction(
  '[Documents] Save document generated',
  props<{ document: Document }>()
);

export const saveDocumentGeneratedSuccess = createAction(
  '[Documents] Save document generated success',
  props<{ savedDocument: Document }>()
);

export const cancelDocument = createAction(
  '[Documents] Cancel document',
  props<{ document: Document }>()
);

export const cancelDocumentSuccess = createAction(
  '[Documents] Cancel document success',
  props<{ cancelledDocument: Document }>()
);

export const documentFails = createAction(
  '[Documents] Document fails',
  props<{ error: any }>()
);

export const cancelDocumentDte = createAction(
  '[Documents] Cancel document DTE',
  props<{ documentParametersDTE: DocumentParameter }>()
);

export const cancelDocumentDteSuccess = createAction(
  '[Documents] Cancel document DTE success',
  props<{ cancelledDocumentDTE: DocumentDTE }>()
);
