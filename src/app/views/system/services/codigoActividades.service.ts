import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import {State} from "../store/reducers/codeActivities.reducer";
import * as actions from '../store/actions/codeActivities.actions';
import * as selectors from '../store/selectors/codeActivities.selectors';

import {CodeActivities} from "../models/codeActivities.model";


@Injectable({
  providedIn: 'root'
})
export class CodeActivitiesService {
  constructor(
    private store: Store<State>
  ) {
  }

  getCodeActivities(): void {
    this.store.dispatch(actions.getCodeActivities());
  }

  selectCodeActivities(): Observable<CodeActivities[]> {
    return this.store.select(selectors.selectCodeActivities);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
