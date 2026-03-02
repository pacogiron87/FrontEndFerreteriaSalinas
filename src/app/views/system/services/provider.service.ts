import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";

import { State } from "../store/reducers/provider.reducer";
import * as actions from '../store/actions/provider.actions';
import * as selectors from '../store/selectors/provider.selectors';

import { Provider } from "../models/provider.model";


@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  constructor(
    private store: Store<State>
  ) {
  }

  getAllProviders(): void {
    this.store.dispatch(actions.getAllProviders());
  }

  getProviders(): void {
    this.store.dispatch(actions.getProviders());
  }

  createProvider(provider: Provider): void {
    this.store.dispatch(actions.createProvider({ provider }));
  }

  updateProvider(provider: Provider): void {
    this.store.dispatch(actions.updateProvider({ provider }));
  }

  updateProviders(providers: Provider[]): void {
    this.store.dispatch(actions.updateProviders({ providers }));
  }

  changeStatusProvider(id: number, active: boolean): void {
    this.store.dispatch(actions.changeStatusProvider({ id, active }));
  }

  clearSavedProvider(): void {
    this.store.dispatch(actions.updateProviderSuccess({ savedProvider: null as any }));
  }

  selectProviders(): Observable<Provider[]> {
    return this.store.select(selectors.selectProviders);
  }

  selectSavedProvider(): Observable<Provider> {
    return this.store.select(selectors.selectSavedProvider);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
