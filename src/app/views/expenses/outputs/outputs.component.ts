import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

// Services
import { LocationService } from "../services/location.service";
import { OutputService } from "../services/output.service";
import { OutputTypeRepository } from "../../../core/repositories/otuput-type.repository";
import { UserService } from "../../system/services/user.service";
import { UtilitiesService } from "../../../core/helpers/utilities.service";
import { AuthService } from '../../../core/services/auth.service';

// Models
import { Output } from "../models/output.model";

@Component({
  selector: 'app-outputs',
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
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    RippleModule
  ],
  providers: [CurrencyPipe],
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly outputService = inject(OutputService);
  private readonly userService = inject(UserService);
  public readonly utilitiesService = inject(UtilitiesService);
  private readonly authService = inject(AuthService);

  readonly isOutputActive = signal(false);
  readonly isSeeDetails = signal(false);

  readonly outputs = toSignal(this.outputService.selectFoundOutputs(), { initialValue: [] });
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly loading = toSignal(this.outputService.selectLoading(), { initialValue: false });
  readonly user = toSignal(this.userService.selectAuthenticateUser());

  readonly outputTypes = OutputTypeRepository;

  outputForm!: FormGroup;

  private readonly savedOutput = toSignal(this.outputService.selectSavedOutput());
  private readonly changedStatus = toSignal(this.outputService.selectChangeStatus());

  constructor() {
    this.initForm();
    effect(() => {
      const saved = this.savedOutput();
      if (saved) this.handleOutputUpdate(saved);
    });
    effect(() => {
      const changed = this.changedStatus();
      if (changed) this.handleStatusUpdate(changed);
    });
  }

  ngOnInit(): void {
    this.outputService.searchOutputs({ startDate: null, endDate: null, location_id: null });
    this.locationService.getLocations();
  }

  private initForm(): void {
    this.outputForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      comment: [null],
      description: [null, [Validators.required]],
      location: [null, [Validators.required]],
      receiver: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  newOutput(): void { this.isOutputActive.set(true); }
  returnOutputsList(): void { this.isOutputActive.set(false); this.isSeeDetails.set(false); this.outputForm.reset(); }

  completeOutput(): void {
    if (this.outputForm.valid) {
      const date = new Date();
      const formVal = this.outputForm.value;
      const output: Output = {
        active: true, amount_output: formVal.amount, comment: formVal.comment,
        created_at: this.utilitiesService.formatDate(date), description: formVal.description,
        id: 0, location_id: formVal.location.id, output_receiver: formVal.receiver,
        output_type: formVal.type.description, update_at: this.utilitiesService.formatDate(date),
        user_id: this.authService.currentUser!.id,
      };
      this.outputService.addOutput(output);
      this.returnOutputsList();
    }
  }

  changeStatus(output: Output, active: boolean): void {
    this.outputService.changeStatusOutput({ id: output.id, status: active, comment: 'Cambio de estado', userId: this.authService.currentUser!.id });
  }

  private handleOutputUpdate(o: Output): void {
    const list = [...this.outputs()];
    const idx = list.findIndex(x => x.id === o.id);
    if (idx >= 0) list[idx] = o; else list.push(o);
    this.outputService.updateOutputs(list);
  }

  private handleStatusUpdate(o: Output): void {
    const list = [...this.outputs()];
    const idx = list.findIndex(x => x.id === o.id);
    if (idx >= 0) { list[idx] = { ...list[idx], active: o.active }; this.outputService.updateOutputs(list); }
  }
}
