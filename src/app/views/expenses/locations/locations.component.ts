import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

// Services
import { LocationService } from "../services/location.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models & Enums
import { Location } from "../models/location.model";

@Component({
  selector: 'app-locations',
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
    RippleModule
  ],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  // Services
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  public readonly utilitiesService = inject(UtilitiesService);

  // Signals for state
  readonly isModalVisible = signal(false);
  readonly locationId = signal(0);
  readonly locationIsActive = signal(true);
  readonly modalTitle = signal('Agregar localidad');

  // Data from Store
  readonly locations = toSignal(this.locationService.selectLocations(), { initialValue: [] });
  readonly loading = toSignal(this.locationService.selectIsLoading(), { initialValue: true });

  // Form
  locationForm!: FormGroup;

  private readonly savedLocation = toSignal(this.locationService.selectSavedLocation());

  constructor() {
    this.initForm();

    // Effect for store updates
    effect(() => {
      const saved = this.savedLocation();
      if (saved) this.handleLocationUpdate(saved);
    });
  }

  ngOnInit(): void {
    this.locationService.getAllLocations();
  }

  private initForm(): void {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  toggleModal(location?: Location): void {
    if (location) {
      this.locationId.set(location.id);
      this.locationIsActive.set(location.active);
      this.modalTitle.set('Editar localidad');
      this.locationForm.patchValue({
        name: location.name !== 'null' ? location.name : '',
        description: location.description !== 'null' ? location.description : '',
      });
    } else {
      this.locationId.set(0);
      this.locationIsActive.set(true);
      this.modalTitle.set('Agregar localidad');
      this.locationForm.reset();
    }
    this.isModalVisible.set(true);
  }

  saveChanges(): void {
    if (this.locationForm.valid) {
      const location: Location = {
        ...this.locationForm.value,
        id: this.locationId(),
        active: this.locationIsActive()
      };

      if (this.locationId() > 0) {
        this.locationService.updateLocation(location);
      } else {
        this.locationService.createLocation(location);
      }
      this.isModalVisible.set(false);
    }
  }

  changeStatus(location: Location, active: boolean): void {
    this.locationService.changeStatusLocation(location.id, active);
  }

  private handleLocationUpdate(location: Location): void {
    const list = [...this.locations()];
    const index = list.findIndex(l => l.id === location.id);

    if (index >= 0) {
      if (!location.name) {
        // Status toggle only
        const updated = { ...list[index], active: !list[index].active };
        list[index] = updated;
      } else {
        // Full update
        list[index] = location;
      }
    } else {
      list.push(location);
    }
    this.locationService.updateLocations(list);
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible.set(event);
    if (!event) {
      this.locationForm.reset();
      this.locationId.set(0);
    }
  }
}
