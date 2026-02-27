import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {LocationService} from "../services/location.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Location} from "../models/location.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";


@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {
  // @ts-ignore
  locationForm: FormGroup;
  locations: Location[] = [];
  locationId = 0;
  locationIsActive = true;
  loading = true;
  isModalVisible = false;
  modalTitle: string | undefined;
  subscriptions: Subscription[] = [];
  statusTypeData = StatusTypeData;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    public utilitiesService: UtilitiesService,
  ) {
  }

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });

    this.locationService.getAllLocations();
    this.subscriptions[0] = this.locationService.selectLocations().subscribe(locations => [...this.locations] = locations);
    this.subscriptions[1] = this.locationService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[2] = this.locationService.selectSavedLocation().subscribe(location => this.updateLocation(location));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(location: Location | undefined = undefined): void {
    this.isModalVisible = !this.isModalVisible;

    if (location) {
      this.locationId = location.id;
      this.locationIsActive = location.active;
      this.modalTitle = 'Editar localidad';
      this.setFormData(location);
    } else {
      this.locationId = 0;
      this.locationIsActive = true;
      this.modalTitle = 'Agregar localidad';
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.locationForm.reset();
      this.locationId = 0;
      this.locationIsActive = true;
    }
  }

  saveChanges(): void {
    const location = this.buildLocation();

    if (this.locationId > 0) {
      this.locationService.updateLocation(location);
    } else {
      this.locationService.createLocation(location);
    }

    this.isModalVisible = false;
  }

  changeStatus(location: Location, active: boolean): void {
    this.locationService.changeStatusLocation(location.id, active);
  }

  updateLocation(location: Location): void {
    if (location) {
      const index = this.locations.findIndex(l => l.id === location.id);

      const locations = [...this.locations];
      if (index >= 0) {

        if (!location.name) {
          location = {...locations[index]};
          location.active = !location.active;
          locations[index] = location;
          this.locationService.updateLocations(locations);
        } else {
          locations[index] = location;
          this.locationService.updateLocations(locations);
        }

      } else {
        locations.push(location);
        this.locationService.updateLocations(locations);
      }
    }
  }

  setFormData(location: Location): void {
    this.locationForm.setValue({
      name: location.name === 'null' ? null : location.name,
      description: location.description === 'null' ? null : location.name,
    })
  }

  buildLocation(): Location {
    const location: Location = this.locationForm.value;
    location.id = this.locationId;
    location.active = this.locationIsActive;

    return location;
  }

}
