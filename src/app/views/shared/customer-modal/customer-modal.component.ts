import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {MunicipalityService} from "../../system/services/municipality.service";
import {CodeActivitiesService} from "../../system/services/codigoActividades.service";

import {Customer} from "../../system/models/customer.model";
import {Municipality} from "../../system/models/municipality.model";
import {CodeActivities} from "../../system/models/codeActivities.model";

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent implements OnInit, OnDestroy {
  @Output() sendCustomer = new EventEmitter<Customer>();
  // @ts-ignore
  customerForm: FormGroup;
  isModalVisible = false;
  customerId = 0;
  customerIsActive = true;
  uniqueitam = false;
  modalTitle: string | undefined;
  // @ts-ignore
  subscriptions: Subscription[] = [];
  municipalities: Municipality[] = [];
  codeActivities: CodeActivities[] = [];
  states: Municipality[] = [];
  cities: Municipality[] = [];
  filteredCodeActivitie: CodeActivities[] = [];

  constructor(
    private fb: FormBuilder,
    private service: MunicipalityService,
    private serviceActivities: CodeActivitiesService,
  ) {
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      address: ['', [Validators.required]],
      alias: [''],
      businessName: [''],
      codeActivitie: [null],
      commercialBusiness: [''],
      codeCommercialBusiness: [''],
      country: [''],
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

    this.service.getMunicipalities(); 
    this.serviceActivities.getCodeActivities();
    this.subscriptions[0] = this.service.selectMunicipalities().subscribe(municipalities => this.getStates(municipalities));
    this.subscriptions[1] = this.serviceActivities.selectCodeActivities().subscribe(codeActivities => this.codeActivities = codeActivities);    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(customer: Customer | undefined = undefined): void {
    this.isModalVisible = !this.isModalVisible;
    if (customer) {
      this.customerId = customer.id;
      this.customerIsActive = customer.status;
      this.modalTitle = 'Editar cliente';
      this.setFormData(customer);
    } else {
      this.customerId = 0;
      this.customerIsActive = true;
      this.modalTitle = 'Agregar cliente';
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.cities = [];
      this.customerForm.reset();
      this.customerId = 0;
      this.customerIsActive = true;
    }
  }

  onSelectChange(event: any): void {
    const selectedValue = event.Codigo;
    const descripcion = this.codeActivities.filter(m => m.Codigo === selectedValue);
    this.customerForm.patchValue({
      commercialBusiness: descripcion[0].Descipcion,
      codeCommercialBusiness: selectedValue,
    });
    console.log(selectedValue, descripcion);
    // Elimina el panel del autocomplete forzosamente
    setTimeout(() => {
      // Eliminar cualquier panel de autocompletado visible usando el selector específico
      const panels = document.querySelectorAll('.p-autocomplete-panel');
      panels.forEach(panel => {
        (panel as HTMLElement).remove(); // Elimina completamente el elemento del DOM
      });
      
      // Como respaldo, también intenta ocultar o remover cualquier elemento relacionado
      const overlays = document.querySelectorAll('.p-component-overlay');
      overlays.forEach(overlay => {
        (overlay as HTMLElement).remove();
      });
      
      // Asegúrate de que el documento tenga el foco en otro elemento
      document.body.focus();
    }, 0);
  }

  filterCodeActivitie(event: any): void {
    const query = event.query;
    const filtered = query.trim().length > 0 
      ? this.codeActivities.filter(c => c.Descipcion.trim().toLowerCase().includes(query.trim().toLowerCase())) 
      : [];
      
    // Crear un campo combinado para mostrar
    this.filteredCodeActivitie = filtered.map(item => ({
      ...item,
      displayField: `${item.Codigo} - ${item.Descipcion}` // Campo combinado
    }));
  }

  onClearCodeActivitie(): void {
    this.customerForm.patchValue({
      codeActivitie: null,
      commercialBusiness: '',
      codeCommercialBusiness: ''
    });
  }

  setFormData(customer: Customer): void {
    debugger;
    this.customerForm.patchValue({
      address: customer.address === 'null' ? null : customer.address,
      alias: customer.alias === 'null' ? null : customer.alias,
      businessName: customer.businessName === 'null' ? null : customer.businessName,
      country: customer.country === 'null' ? null : customer.country,
      departmentAddress: customer.departmentAddress === 'null' ? null : customer.departmentAddress,
      dui: customer.dui === 'null' ? null : customer.dui,
      email: customer.email === 'null' ? null : customer.email,
      isRetentionTax: customer.isRetentionTax,
      IsMajorTaxpayer: customer.isMajorTaxpayer,
      mobile: customer.mobile === 'null' ? null : customer.mobile,
      municipality: customer.municipality === 'null' ? null : customer.municipality,
      name: customer.name === 'null' ? null : customer.name,
      nit: customer.nit === 'null' ? null : customer.nit,
      nrc: customer.nrc === 'null' ? null : customer.nrc,
      phoneHome: customer.phoneHome === 'null' ? null : customer.phoneHome,
    });

    if (customer.departmentAddress !== 'null') {
      this.getCities();
    }
    if (customer.codeCommercialBusiness) {
      this.getCodeActivities(customer.codeCommercialBusiness);
    }
  }

  buildCustomer(): Customer {
    const customer: Customer = this.customerForm.value;
    customer.id = this.customerId;
    customer.status = this.customerIsActive;

    return customer;
  }

  onSaveChanges(): void {
    debugger;
    const customer = this.buildCustomer();
    this.sendCustomer.emit(customer);

    this.isModalVisible = false;
  }

  getStates(municipalities: Municipality[]): void {
    this.municipalities = municipalities;
    this.states = this.municipalities.filter((m, i, arr) => arr.findIndex(e => e.state === m.state) === i);
  }

  getCities(): void {
    const state = this.customerForm.controls['departmentAddress'].value;
    this.cities = this.municipalities.filter(m => m.state === state);
  }

  getCodeActivities(selectedValue: string): void {
    // Eliminar el debugger
    if (!selectedValue || selectedValue === 'null') {
      return;
    }
    
    // Buscar la actividad correspondiente
    const actividad = this.codeActivities.find(m => m.Codigo === selectedValue);
    
    if (actividad) {
      // Crear un objeto con el campo combinado para la visualización
      const actividadConDisplay = {
        ...actividad,
        displayField: `${actividad.Codigo} - ${actividad.Descipcion}`
      };
      
      // 1. Actualizar los valores en el formulario
      this.customerForm.patchValue({
        commercialBusiness: actividad.Descipcion,
        codeCommercialBusiness: selectedValue,
        codeActivitie: actividadConDisplay // Establecer el objeto completo con displayField
      });
      
      // 2. Asegurarse de que el p-autoComplete muestre el valor
      setTimeout(() => {
        // Forzar la actualización del control
        this.customerForm.get('codeActivitie')?.updateValueAndValidity();
        
        // También actualizar el filteredCodeActivitie para asegurar que contenga el elemento
        // Esto es importante para que la interfaz de usuario muestre el valor seleccionado
        this.filteredCodeActivitie = [actividadConDisplay];
        
        // Disparar un evento de cambio para asegurar que la UI se actualice
        const inputElement = document.getElementById('codeActivitie');
        if (inputElement) {
          // Crear y disparar un evento de input para forzar la actualización
          const event = new Event('input', { bubbles: true });
          inputElement.dispatchEvent(event);
        }
      }, 0);
      
      console.log('Actividad seleccionada por defecto:', actividadConDisplay);
    }
  }

  compareState(originalState: string, selectedState: string): boolean {
    if (originalState == null || selectedState == null) {
      return false;
    }

    return originalState === selectedState;
  }

  compareCity(originalCity: string, selectedCity: string): boolean {
    if (originalCity == null || selectedCity == null) {
      return false;
    }

    return originalCity === selectedCity;
  }

}
