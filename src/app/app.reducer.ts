import {InjectionToken} from "@angular/core";
import {ActionReducerMap} from "@ngrx/store";
import {AppState} from "./core/store";
import * as fromMain from './core/store';

// Re-export AppState so it's accessible where AppState is imported from this file
export { AppState };

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<AppState>>(
  'Root reducers token',
  {
    factory: () => fromMain.reducers
  }
)
