import {InjectionToken} from "@angular/core";

import {ActionReducerMap} from "@ngrx/store";

import {AppState} from "./core/store";
import * as fromMain from './core/store';


export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<AppState>>(
  'Root reducers token',
  {
    factory: () => fromMain.reducers
  }
)
