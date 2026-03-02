import { Component, OnInit, signal, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

// Services
import { ProviderService } from "../services/provider.service";
import { NotificationService } from "src/app/core/helpers/notification.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models
import { Provider } from "../models/provider.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-providers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    RippleModule,
    TabsModule,
    FloatLabel,
    IconField,
    InputIcon
  ],
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly providerService = inject(ProviderService);
  private readonly notificationService = inject(NotificationService);
  public readonly utilitiesService = inject(UtilitiesService);

  // Store Signals
  readonly providers = toSignal(this.providerService.selectProviders(), { initialValue: [] });
  readonly loading = toSignal(this.providerService.selectIsLoading(), { initialValue: true });

  // Reaction Signal (Fixed NG0602)
  private readonly savedProvider = toSignal(this.providerService.selectSavedProvider());

  readonly isModalVisible = signal(false);
  readonly providerId = signal(0);
  readonly providerIsActive = signal(true);
  readonly modalTitle = signal('Agregar proveedor');

  providerForm!: FormGroup;

  constructor() {
    this.initForm();

    effect(() => {
      const p = this.savedProvider();
      if (p) {
        this.handleProviderUpdate(p);
      }
    });
  }

  ngOnInit(): void { this.providerService.getAllProviders(); }

  private initForm(): void {
    this.providerForm = this.fb.group({
      code: [''], nrc: [''], nit: [''], fiscal_name: [''], tradename: ['', [Validators.required]],
      address: [''], country: ['El Salvador', [Validators.required]], phone: [''], mobile: [''],
      contact_person: ['', [Validators.required]], email: ['', [Validators.email]],
      facebook: [''], twitter: [''], website: [''], bank_data: [''],
    });
  }

  toggleModal(provider?: Provider): void {
    if (provider) {
      this.providerId.set(provider.id); this.providerIsActive.set(provider.active); this.modalTitle.set('Editar proveedor');
      this.setFormData(provider);
    } else {
      this.providerId.set(0); this.providerIsActive.set(true); this.modalTitle.set('Agregar proveedor');
      this.providerForm.reset({ country: 'El Salvador' });
    }
    this.isModalVisible.set(true);
  }

  private setFormData(provider: Provider): void {
    this.providerForm.patchValue({
      code: provider.code !== 'null' ? provider.code : '', nrc: provider.nrc !== 'null' ? provider.nrc : '',
      nit: provider.nit !== 'null' ? provider.nit : '', fiscal_name: provider.fiscal_name !== 'null' ? provider.fiscal_name : '',
      tradename: provider.tradename !== 'null' ? provider.tradename : '', address: provider.address !== 'null' ? provider.address : '',
      country: provider.country !== 'null' ? provider.country : 'El Salvador', phone: provider.phone !== 'null' ? provider.phone : '',
      mobile: provider.mobile !== 'null' ? provider.mobile : '', contact_person: provider.contact_person !== 'null' ? provider.contact_person : '',
      email: provider.email !== 'null' ? provider.email : '', facebook: provider.facebook !== 'null' ? provider.facebook : '',
      twitter: provider.twitter !== 'null' ? provider.twitter : '', website: provider.website !== 'null' ? provider.website : '',
      bank_data: provider.bank_data !== 'null' ? provider.bank_data : '',
    });
  }

  saveChanges(): void {
    if (this.providerForm.valid) {
      const provider: Provider = { ...this.providerForm.value, id: this.providerId(), active: this.providerIsActive() };
      if (this.providerId() > 0) this.providerService.updateProvider(provider);
      else this.providerService.createProvider(provider);
      this.isModalVisible.set(false);
    }
  }

  changeStatus(provider: Provider, active: boolean): void { this.providerService.changeStatusProvider(provider.id, active); }

  private handleProviderUpdate(p: Provider): void {
    const list = [...this.providers()];
    const idx = list.findIndex(x => x.id === p.id);
    if (idx >= 0) list[idx] = p; else list.push(p);
    this.providerService.updateProviders(list);
    this.providerService.clearSavedProvider();
  }

  handleModalChange(event: boolean): void { this.isModalVisible.set(event); if (!event) { this.providerForm.reset(); this.providerId.set(0); } }
}
