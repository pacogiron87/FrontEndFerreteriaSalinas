import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Store} from "@ngrx/store";

import * as actions from '../store/actions/transaction.actions';
import * as selectors from '../store/selectors/transaction.selectors';
import {State} from "../store/reducers/transaction.reducer";

import {EndTransaction} from "../models/end-transactions.model";
import {Transaction} from "../models/transaction.model";


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    private store: Store<State>
  ) {
  }

  searchTransactions(searchInformation: any): void {
    this.store.dispatch(actions.searchTransaction({
      endDate: searchInformation.endDate,
      location: searchInformation.location,
      location_id: searchInformation.location_id,
      startDate: searchInformation.startDate,
    }));
  }

  addTransaction(transaction: Transaction): void {
    return this.store.dispatch(actions.addTransaction({transaction}));
  }

  changeTransactionStatus(changeStatusInformation: any): void {
    this.store.dispatch(actions.changeTransactionStatus({
      comment: changeStatusInformation.comment,
      id: changeStatusInformation.id,
      status: changeStatusInformation.status,
      userId: changeStatusInformation.userId,
    }));
  }

  startTransaction(startInformation: any): void {
    this.store.dispatch(actions.startTransaction({
      location_id: startInformation.location_id,
      user_id: startInformation.user_id,
    }));
  }

  endTransaction(endTransaction: EndTransaction): void {
    this.store.dispatch(actions.endTransaction({endTransaction}));
  }

  updateTransactions(transactions: Transaction[]): void {
    this.store.dispatch(actions.updateTransactions({transactions}));
  }

  selectFoundTransactions(): Observable<Transaction[]> {
    return this.store.select(selectors.selectFoundTransactions);
  }

  selectUpdatedTransaction(): Observable<Transaction> {
    return this.store.select(selectors.selectUpdatedTransaction);
  }

  selectEndedTransaction(): Observable<Transaction> {
    return this.store.select(selectors.selectEndedTransaction);
  }

  selectChangeStatus(): Observable<Transaction> {
    return this.store.select(selectors.selectChangedStatus);
  }

  selectLoading(): Observable<boolean> {
    return this.store.select(selectors.selectLoading);
  }

  selectError(): Observable<any> {
    return this.store.select(selectors.selectError);
  }

}
