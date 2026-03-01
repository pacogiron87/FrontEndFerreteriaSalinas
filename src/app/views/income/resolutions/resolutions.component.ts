import { Component, OnInit, signal, computed, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

// Services
import { ResolutionService } from "../services/resolution.service";
import { UserService } from "src/app/views/system/services/user.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models & Repositories
import { Resolution } from "../models/resolution.model";
import { InvoiceTypeRepository } from "src/app/core/repositories/invoice-type.repository";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-resolutions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    SelectModule,
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    RippleModule
  ],
  templateUrl: './resolutions.component.html',
  styleUrls: ['./resolutions.component.scss']
})
export class ResolutionsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly resolutionService = inject(ResolutionService);
  private readonly userService = inject(UserService);
  public readonly utilitiesService = inject(UtilitiesService);

  readonly isModalVisible = signal(false);
  readonly resolutionId = signal(0);
  readonly resolutionIsActive = signal(true);
  readonly modalTitle = signal('Agregar resolución');

  readonly resolutions = toSignal(this.resolutionService.selectResolutions(), { initialValue: [] });
  readonly loading = toSignal(this.resolutionService.selectIsLoading(), { initialValue: false });
  readonly user = toSignal(this.userService.selectAuthenticateUser());

  readonly invoiceTypes = InvoiceTypeRepository.filter(t => !t.description.toLowerCase().includes('nota'));

  resolutionForm!: FormGroup;

  private readonly savedResolution = toSignal(this.resolutionService.selectSavedResolution());

  constructor() {
    this.initForm();
    effect(() => {
      const saved = this.savedResolution();
      if (saved) this.handleResolutionUpdate(saved);
    });
  }

  ngOnInit(): void {
    this.resolutionService.getAllResolutions();
  }

  private initForm(): void {
    this.resolutionForm = this.fb.group({
      resolution_number: ['', [Validators.required, Validators.minLength(3)]],
      resolution_number_cu: ['', [Validators.required, Validators.minLength(3)]],
      start_number: [null, [Validators.required]],
      end_number: [null, [Validators.required]],
      bill_type: [null, [Validators.required]],
    });
  }

  toggleModal(resolution?: Resolution): void {
    if (resolution) {
      this.resolutionId.set(resolution.id);
      this.resolutionIsActive.set(resolution.status);
      this.modalTitle.set('Editar resolución');
      this.resolutionForm.patchValue({
        resolution_number: resolution.resolution_number,
        resolution_number_cu: resolution.resolution_number_cu,
        bill_type: resolution.bill_type,
        start_number: resolution.start_number,
        end_number: resolution.end_number,
      });
    } else {
      this.resolutionId.set(0);
      this.resolutionIsActive.set(true);
      this.modalTitle.set('Agregar resolución');
      this.resolutionForm.reset();
    }
    this.isModalVisible.set(true);
  }

  saveChanges(): void {
    if (this.resolutionForm.valid) {
      const val = this.resolutionForm.value;
      const res: Resolution = {
        ...val, id: this.resolutionId(), user_id: Number(this.user()?.id || 0),
        status: this.resolutionIsActive(), last_number: 0,
        created_date: this.utilitiesService.formatDate(new Date())
      };
      if (this.resolutionId() > 0) this.resolutionService.updateResolution(res);
      else this.resolutionService.createResolution(res);
      this.isModalVisible.set(false);
    }
  }

  private handleResolutionUpdate(res: Resolution): void {
    const list = [...this.resolutions()];
    const idx = list.findIndex(r => r.id === res.id);
    if (idx >= 0) {
      if (!res.resolution_number) list[idx] = { ...list[idx], status: !list[idx].status };
      else list[idx] = res;
    } else list.push(res);
    this.resolutionService.updateResolutions(list);
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible.set(event);
    if (!event) { this.resolutionForm.reset(); this.resolutionId.set(0); }
  }
}
