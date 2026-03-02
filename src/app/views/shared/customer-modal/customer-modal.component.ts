import { Component, OnInit, signal, computed, inject, output, model, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';
import { FloatLabel } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';

// Services
import { MunicipalityService } from "../../system/services/municipality.service";
import { CodeActivitiesService } from "../../system/services/codigoActividades.service";

// Models
import { Customer } from "../../system/models/customer.model";
import { Municipality } from "../../system/models/municipality.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AutoCompleteModule,
    InputTextModule,
    ToggleSwitchModule,
    ButtonModule,
    SelectModule,
    RippleModule,
    FloatLabel,
    TooltipModule
  ],
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly codeActivitiesService = inject(CodeActivitiesService);

  sendCustomer = output<Customer>();

  isModalVisible = model(false);
  customerId = signal(0);
  customerIsActive = signal(true);
  modalTitle = signal<string>('Agregar cliente');

  municipalities = toSignal(this.municipalityService.selectMunicipalities(), { initialValue: [] });
  codeActivities = toSignal(this.codeActivitiesService.selectCodeActivities(), { initialValue: [] });

  states = computed(() => {
    const list = this.municipalities();
    return list.filter((m, i, arr) => arr.findIndex(e => e.state === m.state) === i);
  });

  cities = signal<Municipality[]>([]);
  filteredCodeActivities = signal<any[]>([]);

  customerForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.municipalityService.getMunicipalities();
    this.codeActivitiesService.getCodeActivities();
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      address: ['', [Validators.required]],
      alias: [''],
      businessName: [''],
      codeActivitie: [null],
      commercialBusiness: [''],
      codeCommercialBusiness: [''],
      country: ['El Salvador'],
      departmentAddress: ['', Validators.required],
      dui: [''],
      email: ['', [Validators.email]],
      isRetentionTax: [false],
      IsMajorTaxpayer: [false],
      mobile: [''],
      municipality: ['', Validators.required],
      name: ['', [Validators.required]],
      nit: [''],
      nrc: [''],
      phoneHome: [''],
    });

    this.customerForm.get('departmentAddress')?.valueChanges.subscribe(state => {
      this.cities.set(state ? this.municipalities().filter(m => m.state === state) : []);
    });
  }

  toggleModal(customer?: Customer): void {
    if (customer) {
      this.customerId.set(customer.id);
      this.customerIsActive.set(customer.status);
      this.modalTitle.set('Editar cliente');
      this.setFormData(customer);
    } else {
      this.customerId.set(0);
      this.customerIsActive.set(true);
      this.modalTitle.set('Agregar cliente');
      this.customerForm.reset({ country: 'El Salvador', isRetentionTax: false, IsMajorTaxpayer: false });
    }
    this.isModalVisible.set(true);
  }

  private setFormData(customer: Customer): void {
    this.customerForm.patchValue({
      address: customer.address !== 'null' ? customer.address : '',
      alias: customer.alias !== 'null' ? customer.alias : '',
      businessName: customer.businessName !== 'null' ? customer.businessName : '',
      country: customer.country !== 'null' ? customer.country : 'El Salvador',
      departmentAddress: customer.departmentAddress !== 'null' ? customer.departmentAddress : '',
      dui: customer.dui !== 'null' ? customer.dui : '',
      email: customer.email !== 'null' ? customer.email : '',
      isRetentionTax: customer.isRetentionTax,
      IsMajorTaxpayer: customer.isMajorTaxpayer,
      mobile: customer.mobile !== 'null' ? customer.mobile : '',
      municipality: customer.municipality !== 'null' ? customer.municipality : '',
      name: customer.name !== 'null' ? customer.name : '',
      nit: customer.nit !== 'null' ? customer.nit : '',
      nrc: customer.nrc !== 'null' ? customer.nrc : '',
      phoneHome: customer.phoneHome !== 'null' ? customer.phoneHome : '',
    });
  }

  filterCodeActivity(event: any): void {
    const query = event.query.toLowerCase();
    const filtered = this.codeActivities().filter(c => c.Descipcion.toLowerCase().includes(query) || c.Codigo.includes(query));
    this.filteredCodeActivities.set(filtered.map(item => ({ ...item, displayField: `${item.Codigo} - ${item.Descipcion}` })));
  }

  onSelectActivity(event: any): void {
    const act = event.value || event;
    this.customerForm.patchValue({ commercialBusiness: act.Descipcion, codeCommercialBusiness: act.Codigo });
  }

  onSaveChanges(): void {
    if (this.customerForm.valid) {
      this.sendCustomer.emit({ ...this.customerForm.value, id: this.customerId(), status: this.customerIsActive() });
      this.isModalVisible.set(false);
    }
  }
}
