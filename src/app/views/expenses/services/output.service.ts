import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import * as actions from '../store/actions/output.actions';
import * as selectors from '../store/selectors/output.selectors';
import {State} from "../store/reducers/output.reducer";

import {Output} from "../models/output.model";


@Injectable({
  providedIn: 'root'
})
export class OutputService {
  constructor(
    private store: Store<State>
  ) {
  }

  searchOutputs(searchInformation: any): void {
    this.store.dispatch(actions.searchOutputs({
      startDate: searchInformation.startDate,
      endDate: searchInformation.endDate,
      location_id: searchInformation.location_id,
    }));
  }

  addOutput(output: Output): void {
    this.store.dispatch(actions.addOutput({output}));
  }

  changeStatusOutput(changeStatusInformation: any): void {
    this.store.dispatch(actions.changeStatusOutput({
      id: changeStatusInformation.id,
      status: changeStatusInformation.status,
      comment: changeStatusInformation.comment,
      userId: changeStatusInformation.userId,
    }));
  }

  updateOutputs(outputs: Output[]): void {
    this.store.dispatch(actions.updateOutputs({outputs}));
  }

  selectFoundOutputs(): Observable<Output[]> {
    return this.store.select(selectors.selectFoundOutputs);
  }

  selectSavedOutput(): Observable<Output> {
    return this.store.select(selectors.selectSavedOutput);
  }

  selectChangeStatus(): Observable<Output> {
    return this.store.select(selectors.selectChangeStatus);
  }

  selectLoading(): Observable<boolean> {
    return this.store.select(selectors.selectLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
