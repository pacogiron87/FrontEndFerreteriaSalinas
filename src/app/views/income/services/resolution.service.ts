import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import {State} from "../store/reducers/resolution.reducer";
import * as actions from '../store/actions/resolution.actions';
import * as selectors from '../store/selectors/resolution.selectors';

import {Resolution} from "../models/resolution.model";


@Injectable({
  providedIn: 'root'
})
export class ResolutionService {
  constructor(
    private store: Store<State>,
  ) {
  }

  getAllResolutions(): void {
    this.store.dispatch(actions.getAllResolutions());
  }

  createResolution(resolution: Resolution): void {
    this.store.dispatch(actions.createResolution({resolution}));
  }

  updateResolution(resolution: Resolution): void {
    this.store.dispatch(actions.updateResolution({resolution}));
  }

  updateResolutions(resolutions: Resolution[]): void {
    this.store.dispatch(actions.updateResolutions({resolutions}));
  }

  selectResolutions(): Observable<Resolution[]> {
    return this.store.select(selectors.selectResolutions);
  }

  selectSavedResolution(): Observable<Resolution> {
    return this.store.select(selectors.selectSavedResolution);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
