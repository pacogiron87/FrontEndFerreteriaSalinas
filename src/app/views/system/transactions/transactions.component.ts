import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';

// Services
import { LocationService } from "src/app/views/expenses/services/location.service";
import { TransactionService } from "../services/transaction.service";
import { UserService } from "../services/user.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";
import { AuthService } from '../../../core/services/auth.service';

// Models
import { Transaction } from "../models/transaction.model";
import { EndTransaction } from "../models/end-transactions.model";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    RippleModule,
    PasswordModule
  ],
  providers: [CurrencyPipe],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly transactionService = inject(TransactionService);
  private readonly userService = inject(UserService);
  public readonly utilitiesService = inject(UtilitiesService);
  private readonly authService = inject(AuthService);

  readonly isModalVisible = signal(false);
  readonly isCloseTransactionActive = signal(false);
  readonly isFirstTime = signal(false);

  readonly transactions = toSignal(this.transactionService.selectFoundTransactions(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly loading = toSignal(this.transactionService.selectLoading(), { initialValue: false });
  readonly user = toSignal(this.userService.selectAuthenticateUser());

  searchForm!: FormGroup;
  initialTransactionForm!: FormGroup;
  closeTransactionForm!: FormGroup;

  currentTransaction = signal<Transaction | null>(null);

  private readonly endedTransaction = toSignal(this.transactionService.selectEndedTransaction());
  private readonly changedStatus = toSignal(this.transactionService.selectChangeStatus());

  constructor() {
    this.initForms();
    effect(() => {
      const ended = this.endedTransaction();
      if (ended && ended.status_balance?.toLowerCase().includes('finalizado')) {
        this.refreshList(ended);
        this.isCloseTransactionActive.set(false);
      }
    });
    effect(() => {
      const changed = this.changedStatus();
      if (changed) this.refreshList(changed, true);
    });
  }

  ngOnInit(): void {
    this.locationService.getLocations();
    this.transactionService.searchTransactions({ endDate: null, location: null, location_id: null, startDate: null });
  }

  private initForms(): void {
    this.searchForm = this.fb.group({ location: [''] });
    this.initialTransactionForm = this.fb.group({
      location: [null, Validators.required],
      password: [null, Validators.required],
      start_balance: [null],
    });
    this.closeTransactionForm = this.fb.group({
      one_cent_quantity: [0], one_cent_amount: [0],
      five_cent_quantity: [0], five_cent_amount: [0],
      ten_cent_quantity: [0], ten_cent_amount: [0],
      twenty_five_cent_quantity: [0], twenty_five_cent_amount: [0],
      one_dollar_quantity: [0], one_dollar_amount: [0],
      two_dollar_quantity: [0], two_dollar_amount: [0],
      five_dollar_quantity: [0], five_dollar_amount: [0],
      ten_dollar_quantity: [0], ten_dollar_amount: [0],
      twenty_dollar_quantity: [0], twenty_dollar_amount: [0],
      fifty_dollar_quantity: [0], fifty_dollar_amount: [0],
      one_hundred_dollar_quantity: [0], one_hundred_dollar_amount: [0],
      pos_amount: [0], transfer_bank_amount: [0], cheque_amount: [0], link_pay_amount: [0],
      comment: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  search(): void { const loc = this.searchForm.get('location')?.value; this.transactionService.searchTransactions({ endDate: null, location: loc, location_id: loc?.id, startDate: null }); }
  checkFirstTime(): void {
    const loc = this.initialTransactionForm.get('location')?.value;
    if (!loc) return;
    this.isFirstTime.set(!this.transactions().some(t => t.location_name === loc.name));
  }

  openTransaction(): void {
    if (this.initialTransactionForm.valid) {
      const val = this.initialTransactionForm.value;
      if (!this.isFirstTime()) this.transactionService.startTransaction({ location_id: val.location.id, user_id: this.authService.currentUser!.id });
      else this.transactionService.addTransaction({ id: 0, start_balance: val.start_balance, user_id: this.authService.currentUser!.id, location_id: val.location.id });
      this.isModalVisible.set(false); this.initialTransactionForm.reset();
    }
  }

  inactiveTransaction(t: Transaction): void { this.transactionService.changeTransactionStatus({ id: t.id, userId: this.authService.currentUser!.id, status: false, comment: 'Inactivo' }); }

  closeTransaction(t: Transaction): void {
    this.currentTransaction.set(t);
    this.isCloseTransactionActive.set(true);
    this.closeTransactionForm.reset();
  }

  completeTransaction(): void {
    if (this.closeTransactionForm.valid && this.currentTransaction()) {
      const val = this.closeTransactionForm.value;
      const trans = this.currentTransaction()!;
      const end: EndTransaction = { ...val, id: 0, id_balance: trans.id, location_id: trans.location_id!, start_balance: trans.start_balance!, start_date: trans.start_date!, total_balance_detail: this.calculateTotalBalance(), user_id: this.authService.currentUser!.id };
      this.transactionService.endTransaction(end);
    }
  }

  public calculateTotalBalance(): number {
    let total = 0;
    Object.keys(this.closeTransactionForm.controls).forEach(key => { if (key.includes('amount')) total += (this.closeTransactionForm.get(key)?.value || 0); });
    return total;
  }

  private refreshList(t: Transaction, isStatus = false): void {
    const list = [...this.transactions()];
    const idx = list.findIndex(x => x.id === t.id);
    if (idx >= 0) { list[idx] = isStatus ? { ...list[idx], active: t.active, status_balance: 'Inactivo' } : t; this.transactionService.updateTransactions(list); }
  }

  updateAmount(partial: string, denom: number, isQty: boolean): void {
    const qtyCtrl = this.closeTransactionForm.get(`${partial}_quantity`);
    const amtCtrl = this.closeTransactionForm.get(`${partial}_amount`);
    if (isQty) amtCtrl?.setValue(parseFloat(((qtyCtrl?.value || 0) * denom).toFixed(2)));
    else qtyCtrl?.setValue(Math.floor((amtCtrl?.value || 0) / denom));
  }
}
