import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import {State} from "../store/reducers/municipality.reducer";
import * as actions from '../store/actions/municipality.actions';
import * as selectors from '../store/selectors/municipality.selectors';

import {Municipality} from "../models/municipality.model";


@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {
  constructor(
    private store: Store<State>
  ) {
  }

  getMunicipalities(): void {
    this.store.dispatch(actions.getMunicipalities());
  }

  selectMunicipalities(): Observable<Municipality[]> {
    return this.store.select(selectors.selectMunicipalities);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
