import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {LocationService} from "src/app/views/expenses/services/location.service";
import {NotificationService} from "src/app/core/helpers/notification.service";
import {TransactionService} from "../services/transaction.service";
import {UserService} from "../services/user.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {EndTransaction} from "../models/end-transactions.model";
import {Location} from "src/app/views/expenses/models/location.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";
import {Transaction} from "../models/transaction.model";
import {User} from "../models/user.model";
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  searchInformation = {
    endDate: null,
    location: null,
    location_id: null,
    startDate: null,
  };
  startInformation = {
    location_id: 0,
    user_id: '0',
  };
  changeStatusInformation = {
    comment: '',
    id: 0,
    status: false,
    userId: '0',
  };
  locationInformation={
      location: null,

  }
  tabIndex!: number;
  searchForm!: FormGroup;
  transactions: Transaction[] = [];
  // @ts-ignore
  transaction: Transaction;
  statusTypeData = StatusTypeData;
  loading = false;
  subscriptions: Subscription[] = [];
  // @ts-ignore
  initialTransactionForm: FormGroup;

  // @ts-ignore
  closeTransactionForm: FormGroup;
  locations: Location[] = [];
  // @ts-ignore
  user: User;
  isModalVisible = false;
  isCloseTransactionActive = false;
  isFirstTime = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private transactionService: TransactionService,
    private userService: UserService,
    public utilitiesService: UtilitiesService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      location: [''],
    });
    this.initialTransactionForm = this.fb.group({
      location: [null, Validators.required],
      password: [null, Validators.required],
      start_balance: [null],
    });
    this.closeTransactionForm = this.fb.group({
      one_cent_quantity: [0, Validators.required],
      one_cent_amount: [0, Validators.required],
      five_cent_quantity: [0, Validators.required],
      five_cent_amount: [0, Validators.required],
      ten_cent_quantity: [0, Validators.required],
      ten_cent_amount: [0, Validators.required],
      twenty_five_cent_quantity: [0, Validators.required],
      twenty_five_cent_amount: [0, Validators.required],
      one_dollar_quantity: [0, Validators.required],
      one_dollar_amount: [0, Validators.required],
      two_dollar_quantity: [0, Validators.required],
      two_dollar_amount: [0, Validators.required],
      five_dollar_quantity: [0, Validators.required],
      five_dollar_amount: [0, Validators.required],
      ten_dollar_quantity: [0, Validators.required],
      ten_dollar_amount: [0, Validators.required],
      twenty_dollar_quantity: [0, Validators.required],
      twenty_dollar_amount: [0, Validators.required],
      fifty_dollar_quantity: [0, Validators.required],
      fifty_dollar_amount: [0, Validators.required],
      one_hundred_dollar_quantity: [0, Validators.required],
      one_hundred_dollar_amount: [0, Validators.required],
      cheque_quantity: [0, Validators.required],
      cheque_amount: [0, Validators.required],
      transfer_bank_quantity: [0, Validators.required],
      transfer_bank_amount: [0, Validators.required],
      pos_quantity: [0, Validators.required],
      pos_amount: [0, Validators.required],
      link_pay_quantity: [0, Validators.required],
      link_pay_amount: [0, Validators.required],
      comment: [null, [Validators.required, Validators.minLength(4)]],
    });

    this.locationService.getLocations();
    this.transactionService.searchTransactions(this.searchInformation);
    this.subscriptions[0] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
    this.subscriptions[1] = this.transactionService.selectChangeStatus().subscribe(transaction => this.updateTransactionListFromChangeStatus(transaction));
    this.subscriptions[2] = this.transactionService.selectEndedTransaction().subscribe(transaction => this.verifyEndedTransaction(transaction));
    this.subscriptions[3] = this.transactionService.selectFoundTransactions().subscribe(transactions => this.transactions = transactions);
    this.subscriptions[4] = this.transactionService.selectLoading().subscribe(loading => this.loading = loading);
    this.subscriptions[5] = this.transactionService.selectUpdatedTransaction().subscribe(transaction => this.updateTransactionList(transaction));
    this.subscriptions[6] = this.userService.selectAuthenticateUser().subscribe(user => this.user = user);
  }
  search(): void {
    this.locationInformation = this.searchForm.value;
    this.searchInformation.location=this.locationInformation.location;

    this.processSearch();
  }
  processSearch(): void {

    this.transactionService.searchTransactions(this.searchInformation);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.isFirstTime = false;
      this.initialTransactionForm.reset();
    }
  }

  openTransaction(): void {
    if (this.isValidPassword(this.initialTransactionForm.controls['password'].value)) {
      if (!this.isFirstTime) {
        this.startInformation = {
          location_id: this.initialTransactionForm.controls['location'].value.id,
          user_id: this.authService.currentUser!.id,
        };
        this.transactionService.startTransaction(this.startInformation);
      } else {
        const date = new Date();
        const transaction: Transaction = {
          id: 0,
          start_balance: this.initialTransactionForm.controls['start_balance'].value,
          user_id: this.authService.currentUser!.id,
          location_id: this.initialTransactionForm.controls['location'].value.id,
        };
        this.transactionService.addTransaction(transaction);
      }

      this.isModalVisible = false;
      this.initialTransactionForm.reset();
    } else {
      this.notificationService.warning('El password ingresado es incorrecto');
    }
  }

  isFirstTimeToOpen(): void {
    const foundTransactions = this.transactions.filter(transaction => this.initialTransactionForm.controls['location'].value.name == transaction.location_name);

    this.isFirstTime = foundTransactions.length === 0;

    if (this.isFirstTime) {
      this.initialTransactionForm.controls['start_balance'].setValidators(Validators.required);
    } else {
      this.initialTransactionForm.controls['start_balance'].setValidators(null);
    }
    this.initialTransactionForm.controls['start_balance'].updateValueAndValidity();
  }

  inactiveTransaction(transaction: Transaction): void {
    this.changeStatusInformation.id = transaction.id;
    this.changeStatusInformation.userId = this.authService.currentUser!.id;
    this.changeStatusInformation.comment = transaction.comment ?? 'Desactivar registro';
    this.transactionService.changeTransactionStatus(this.changeStatusInformation);
  }

  closeTransaction(transaction: Transaction): void {
    this.transaction = transaction;
    this.isCloseTransactionActive = true;
  }

  isTransactionOpen(transaction: Transaction): boolean {
    return transaction.status_balance!.toLowerCase().includes('inicio');
  }

  isTransactionFinished(transaction: Transaction): boolean {
    return transaction.status_balance!.toLowerCase().includes('finalizado');
  }

  isValidPassword(password: String): boolean {
    return true;
  }

  updateTransactionListFromChangeStatus(transaction: Transaction): void {
    if (transaction) {
      const index = this.transactions.findIndex(t => t.id === transaction.id);

      const transactions = [...this.transactions];

      if (index >= 0) {
        transactions[index].active = transaction.active;
        transactions[index].status_balance = 'Inactivo';
      }

      this.transactionService.updateTransactions(transactions);
    }
  }

  updateTransactionList(transaction: Transaction): void {
    if (transaction) {
      const index = this.transactions.findIndex(t => t.id === transaction.id);

      const transactions = [...this.transactions];

      if (index >= 0) {
        transactions[index] = transaction;
      } else {
        transactions.push(transaction);
      }

      this.transactionService.updateTransactions(transactions);
    }
  }

  verifyEndedTransaction(transaction: Transaction): void {
    if (transaction) {
      if (transaction.status_balance!.toLowerCase().includes('finalizado')) {
        this.updateTransactionList(transaction);
        this.returnTransactionsList();
      }
    }
  }

  returnTransactionsList(): void {
    this.isCloseTransactionActive = false;
    this.resetCloseForm();
  }

  resetCloseForm(): void {
    this.closeTransactionForm.patchValue({
      one_cent_quantity: 0,
      one_cent_amount: 0,
      five_cent_quantity: 0,
      five_cent_amount: 0,
      ten_cent_quantity: 0,
      ten_cent_amount: 0,
      twenty_five_cent_quantity: 0,
      twenty_five_cent_amount: 0,
      one_dollar_quantity: 0,
      one_dollar_amount: 0,
      two_dollar_quantity: 0,
      two_dollar_amount: 0,
      five_dollar_quantity: 0,
      five_dollar_amount: 0,
      ten_dollar_quantity: 0,
      ten_dollar_amount: 0,
      twenty_dollar_quantity: 0,
      twenty_dollar_amount: 0,
      fifty_dollar_quantity: 0,
      fifty_dollar_amount: 0,
      one_hundred_dollar_quantity: 0,
      one_hundred_dollar_amount: 0,
      cheque_quantity: 0,
      cheque_amount: 0,
      transfer_bank_quantity: 0,
      transfer_bank_amount: 0,
      pos_quantity: 0,
      pos_amount: 0,
      link_pay_quantity: 0,
      link_pay_amount: 0,
      comment: [null],
    });
  }

  calculateQuantity(event: any, denomination: number, partialName: string): void {
    const amount = this.closeTransactionForm.controls[`${partialName}_amount`];
    const quantity = this.closeTransactionForm.controls[`${partialName}_quantity`];
    if (event.target.value.length == 0) {
      amount.setValue(0);
      quantity.setValue(0);
    } else if (!Number.isNaN(event.target.value)) {
      const newQuantity = parseFloat(event.target.value) / denomination;
      if (Number.isInteger(newQuantity)) {
        quantity.setValue(newQuantity);
      } else {
        amount.setValue(0);
        quantity.setValue(0);
      }
    } else {
      amount.setValue(0);
      quantity.setValue(0);
    }
  }

  calculateAmount(event: any, denomination: number, partialName: string): void {
    const amount = this.closeTransactionForm.controls[`${partialName}_amount`];
    const quantity = this.closeTransactionForm.controls[`${partialName}_quantity`];
    if (event.target.value.length == 0) {
      amount.setValue(0);
      quantity.setValue(0);
    } else if (!Number.isNaN(event.target.value)) {
      amount.setValue((parseInt(event.target.value) * denomination).toFixed(2));
    } else {
      amount.setValue(0);
      quantity.setValue(0);
    }
  }

  isValidToClose(): boolean {
    let fails = 0;
    if (this.closeTransactionForm.controls['comment'].value == null) {
      fails++;
    }
   
    return this.closeTransactionForm.valid && fails === 0;
  }

  calculateTotalBalance(): number {
    let total = 0;

    Object.keys(this.closeTransactionForm.controls).forEach(key => {
      if (key.toLowerCase().includes('amount')) {
        total = total + parseFloat(this.closeTransactionForm.controls[key].value);
      }
    });

    return total;
  }

  completeTransaction(): void {
    const endTransaction: EndTransaction = {
      cheque_amount: this.closeTransactionForm.controls['cheque_amount'].value,
      cheque_quantity: this.closeTransactionForm.controls['cheque_quantity'].value,
      comment: this.closeTransactionForm.controls['comment'].value,
      fifty_dollar_amount: this.closeTransactionForm.controls['fifty_dollar_amount'].value,
      fifty_dollar_quantity: this.closeTransactionForm.controls['fifty_dollar_quantity'].value,
      five_cent_amount: this.closeTransactionForm.controls['five_cent_amount'].value,
      five_cent_quantity: this.closeTransactionForm.controls['five_cent_quantity'].value,
      five_dollar_amount: this.closeTransactionForm.controls['five_dollar_amount'].value,
      five_dollar_quantity: this.closeTransactionForm.controls['five_dollar_quantity'].value,
      id: 0,
      id_balance: this.transaction.id,
      link_pay_amount: this.closeTransactionForm.controls['link_pay_amount'].value,
      link_pay_quantity: this.closeTransactionForm.controls['link_pay_quantity'].value,
      location_id: this.transaction.location_id!,
      one_cent_amount: this.closeTransactionForm.controls['one_cent_amount'].value,
      one_cent_quantity: this.closeTransactionForm.controls['one_cent_quantity'].value,
      one_dollar_amount: this.closeTransactionForm.controls['one_dollar_amount'].value,
      one_dollar_quantity: this.closeTransactionForm.controls['one_dollar_quantity'].value,
      one_hundred_dollar_amount: this.closeTransactionForm.controls['one_hundred_dollar_amount'].value,
      one_hundred_dollar_quantity: this.closeTransactionForm.controls['one_hundred_dollar_quantity'].value,
      pos_amount: this.closeTransactionForm.controls['pos_amount'].value,
      pos_quantity: this.closeTransactionForm.controls['pos_quantity'].value,
      start_balance: this.transaction.start_balance!,
      start_date: this.transaction.start_date!,
      ten_cent_amount: this.closeTransactionForm.controls['ten_cent_amount'].value,
      ten_cent_quantity: this.closeTransactionForm.controls['ten_cent_quantity'].value,
      ten_dollar_amount: this.closeTransactionForm.controls['ten_dollar_amount'].value,
      ten_dollar_quantity: this.closeTransactionForm.controls['ten_dollar_quantity'].value,
      total_balance_detail: this.calculateTotalBalance(),
      transfer_bank_amount: this.closeTransactionForm.controls['transfer_bank_amount'].value,
      transfer_bank_quantity: this.closeTransactionForm.controls['transfer_bank_quantity'].value,
      twenty_dollar_amount: this.closeTransactionForm.controls['twenty_dollar_amount'].value,
      twenty_dollar_quantity: this.closeTransactionForm.controls['twenty_dollar_quantity'].value,
      twenty_five_cent_amount: this.closeTransactionForm.controls['twenty_five_cent_amount'].value,
      twenty_five_cent_quantity: this.closeTransactionForm.controls['twenty_five_cent_quantity'].value,
      two_dollar_amount: this.closeTransactionForm.controls['two_dollar_amount'].value,
      two_dollar_quantity: this.closeTransactionForm.controls['two_dollar_quantity'].value,
      user_id: this.authService.currentUser!.id,
    };

    this.transactionService.endTransaction(endTransaction);
  }

}
