import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {NotificationService} from "src/app/core/helpers/notification.service";
import {ProviderService} from "../services/provider.service";

import {Provider} from "../models/provider.model";


@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit, OnDestroy {
  // @ts-ignore
  providerForm: FormGroup;
  providers: Provider[] = [];
  providerId = 0;
  providerIsActive = true;

  loading = true;
  isModalVisible = false;
  modalTitle: string | undefined;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.providerForm = this.fb.group({
      code: [''],
      nrc: [''],
      nit: [''],
      fiscal_name: [''],
      tradename: ['', [Validators.required]],
      address: [''],
      country: ['', [Validators.required]],
      phone: [''],
      mobile: [''],
      contact_person: ['', [Validators.required]],
      email: [''],
      facebook: [''],
      twitter: [''],
      website: [''],
      bank_data: [''],
    });

    this.providerService.getAllProviders();
    this.subscriptions[0] = this.providerService.selectProviders().subscribe(providers => [...this.providers] = providers);
    this.subscriptions[1] = this.providerService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[2] = this.providerService.selectSavedProvider().subscribe(provider => this.updateProvider(provider));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(provider: Provider | undefined = undefined): void {
    this.isModalVisible = !this.isModalVisible;

    if (provider) {
      this.providerId = provider.id;
      this.providerIsActive = provider.active;
      this.modalTitle = 'Editar proveedor';
      this.setFormData(provider);
    } else {
      this.providerId = 0;
      this.providerIsActive = true;
      this.modalTitle = 'Agregar proveedor';
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.providerForm.reset();
      this.providerId = 0;
      this.providerIsActive = true;
    }
  }

  saveChanges(): void {
    const provider = this.buildProvider();

    if (!this.isCompleteData(provider)) {
      this.notificationService.warning('¡Debe colocar al menos un numero telefónico!');
      return;
    }

    if (provider.id > 0) {
      this.providerService.updateProvider(provider);
    } else {
      this.providerService.createProvider(provider);
    }

    this.isModalVisible = false;
  }

  changeStatus(provider: Provider, active: boolean): void {
    this.providerService.changeStatusProvider(provider.id, active);
  }

  updateProvider(provider: Provider): void {
    if (provider) {
      const index = this.providers.findIndex(p => p.id === provider.id);

      const providers = [...this.providers];
      if (index >= 0) {
        if (!provider.fiscal_name) {
          provider = {...providers[index]};
          provider.active = !provider.active;
          providers[index] = provider;
          this.providerService.updateProviders(providers);
        } else {
          providers[index] = provider;
          this.providerService.updateProviders(providers);
        }

      } else {
        providers.push(provider);
        this.providerService.updateProviders(providers);
      }
    }
  }

  setFormData(provider: Provider): void {
    this.providerForm.setValue({
      code: provider.code === 'null' ? null : provider.code,
      nrc: provider.nrc === 'null' ? null : provider.nrc,
      nit: provider.nit === 'null' ? null : provider.nit,
      fiscal_name: provider.fiscal_name === 'null' ? null : provider.fiscal_name,
      tradename: provider.tradename === 'null' ? null : provider.tradename,
      address: provider.address === 'null' ? null : provider.address,
      country: provider.country === 'null' ? null : provider.country,
      phone: provider.phone === 'null' ? null : provider.phone,
      mobile: provider.mobile === 'null' ? null : provider.mobile,
      contact_person: provider.contact_person === 'null' ? null : provider.contact_person,
      email: provider.email === 'null' ? null : provider.email,
      facebook: provider.facebook === 'null' ? null : provider.facebook,
      twitter: provider.twitter === 'null' ? null : provider.twitter,
      website: provider.website === 'null' ? null : provider.website,
      bank_data: provider.bank_data === 'null' ? null : provider.bank_data,
    });
  }

  buildProvider(): Provider {
    const provider: Provider = this.providerForm.value;
    provider.id = this.providerId;
    provider.active = this.providerIsActive;

    return provider;
  }

  isCompleteData(provider: Provider): boolean {
    let count = 0;

    if (provider.phone === null || provider.phone.trim().length < 8) {
      count++;
    }

    if (provider.mobile === null || provider.mobile.trim().length < 8) {
      count++;
    }

    return count >= 0 && count <= 1;
  }

}
