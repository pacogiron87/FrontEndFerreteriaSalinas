import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";

import { State } from "../store/reducers/location.reducer";
import * as actions from '../store/actions/location.actions';
import * as selectors from '../store/selectors/location.selectors';

import { Location } from '../models/location.model';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private store: Store<State>
  ) {
  }

  getAllLocations(): void {
    this.store.dispatch(actions.getAllLocations());
  }

  getLocations(): void {
    this.store.dispatch(actions.getLocations());
  }

  createLocation(location: Location): void {
    this.store.dispatch(actions.createLocation({ location }));
  }

  updateLocation(location: Location): void {
    this.store.dispatch(actions.updateLocation({ location }));
  }

  updateLocations(locations: Location[]): void {
    this.store.dispatch(actions.updateLocations({ locations }));
  }

  clearSavedLocation(): void {
    this.store.dispatch(actions.updateLocationSuccess({ savedLocation: null as any }));
  }

  changeStatusLocation(id: number, active: boolean): void {
    this.store.dispatch(actions.changeStatusLocation({ id, active }));
  }

  selectLocations(): Observable<Location[]> {
    return this.store.select(selectors.selectLocations);
  }

  selectSavedLocation(): Observable<Location> {
    return this.store.select(selectors.selectSavedLocation);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
