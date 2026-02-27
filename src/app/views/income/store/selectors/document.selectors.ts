import {createFeatureSelector, createSelector} from "@ngrx/store";

import {documentFeatureKey, State} from "../reducers/document.reducer";


const selectDocumentsState = createFeatureSelector<State>(documentFeatureKey);

export const selectValidateDocument = createSelector(
  selectDocumentsState,
  (state: State) => state.validDocument
)

export const selectSavedDocument = createSelector(
  selectDocumentsState,
  (state: State) => state.savedDocument
)

export const selectCancelledDocument = createSelector(
  selectDocumentsState,
  (state: State) => state.cancelledDocument
)

export const selectIsLoading = createSelector(
  selectDocumentsState,
  (state: State) => state.isLoading
)

export const selectError = createSelector(
  selectDocumentsState,
  (state: State) => state.error
)

export const selectCancelledDocumentDte = createSelector(
  selectDocumentsState,
  (state: State) => state.cancelledDocumentDTE
)