import {Injectable, inject} from "@angular/core";
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
  private readonly store = inject(Store<State>);

  authenticate(userName: string, password: string): void {
    this.store.dispatch(actions.authenticate({userName, password}));
  }

  getUsers(): void {
    this.store.dispatch(actions.getUsers());
  }

  createUser(user: User): void {
    this.store.dispatch(actions.createUser({user}));
  }

  updateUser(user: User): void {
    this.store.dispatch(actions.updateUser({user}));
  }

  changeStatusUser(id: string, active: boolean): void {
    this.store.dispatch(actions.changeStatusUser({id, active}));
  }

  selectUsers(): Observable<User[]> {
    return this.store.select(selectors.selectUsers);
  }

  selectIsLoading(): Observable<boolean> {
    return this.store.select(selectors.selectIsLoading);
  }

  selectAuthenticateUser(): Observable<User> {
    return this.store.select(selectors.selectAuthenticatedUser).pipe(map(u => u as User));
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
