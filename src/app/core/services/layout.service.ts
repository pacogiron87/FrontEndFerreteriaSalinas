import {Injectable} from '@angular/core';

import {Store} from "@ngrx/store";

import {closeSession} from "../store/actions/layout.actions";
import {State} from "../store/reducers/layout.reducer";


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private store: Store<State>
  ) {
  }

  closeSession(): void {
    this.store.dispatch(closeSession());
  }
}
