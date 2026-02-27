import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {State} from "../store/reducers/user.reducer";
import * as actions from '../store/actions/user.actions';
import * as selectors from '../store/selectors/user.selectors';
import {map, Observable} from "rxjs";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private store: Store<State>
  ) {
  }

  authenticate(userName: string, password: string): void {
    this.store.dispatch(actions.authenticate({userName, password}));
  }

  selectAuthenticateUser(): Observable<User> {
    return this.store.select(selectors.selectAuthenticatedUser);
  }

  selectAuthenticateFails(): Observable<any> {
    return this.store.select(selectors.selectAuthenticateFails);
  }

  isAuth(): Observable<boolean> {
    return this.store.select(selectors.selectAuthenticatedUser).pipe(
      map(user => user !== null)
    );
  }

}
