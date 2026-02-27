import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {InvoiceTypeRepository} from "src/app/core/repositories/invoice-type.repository";
import {ResolutionService} from "../services/resolution.service";
import {UserService} from "src/app/views/system/services/user.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Resolution} from "../models/resolution.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";
import {User} from "src/app/views/system/models/user.model";


@Component({
  selector: 'app-resolutions',
  templateUrl: './resolutions.component.html',
  styleUrls: ['./resolutions.component.scss']
})
export class ResolutionsComponent implements OnInit, OnDestroy {
  // @ts-ignore
  resolutionForm: FormGroup;
  resolutions: Resolution[] = [];
  resolutionId = 0;
  resolutionIsActive = true;
  // @ts-ignore
  user: User;
  loading = false;
  isModalVisible = false;
  modalTitle: string | undefined;
  subscriptions: Subscription[] = [];
  statusTypeData = StatusTypeData;
  invoiceTypes = InvoiceTypeRepository.filter(t => !t.description.toLowerCase().includes('nota'));

  constructor(
    private fb: FormBuilder,
    private resolutionService: ResolutionService,
    private userService: UserService,
    public utilitiesService: UtilitiesService,
  ) { }

  ngOnInit(): void {
    this.resolutionForm = this.fb.group({
      resolution_number: ['', [Validators.required, Validators.minLength(3)]],
      resolution_number_cu: ['', [Validators.required, Validators.minLength(3)]],
      start_number: [null, [Validators.required]],
      end_number: [null, [Validators.required]],
      bill_type: [null, [Validators.required]],
    });

    this.resolutionService.getAllResolutions();
    this.subscriptions[0] = this.resolutionService.selectResolutions().subscribe(resolutions => [...this.resolutions] = resolutions);
    this.subscriptions[1] = this.resolutionService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[2] = this.resolutionService.selectSavedResolution().subscribe(savedResolution => this.updateResolution(savedResolution));
    this.subscriptions[3] = this.userService.selectAuthenticateUser().subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(resolution: Resolution | undefined = undefined): void {
    this.isModalVisible = !this.isModalVisible;

    if (resolution) {
      this.resolutionId = resolution.id;
      this.resolutionIsActive = true;
      this.modalTitle = 'Editar resolución';
      this.setFormData(resolution);
    } else {
      this.resolutionId = 0;
      this.resolutionIsActive = true;
      this.modalTitle = 'Agregar resolución';
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.resolutionForm.reset();
      this.resolutionId = 0;
      this.resolutionIsActive = true;
    }
  }

  saveChanges(): void {
    const resolution = this.buildResolution();

    if (this.resolutionId > 0) {
      this.resolutionService.updateResolution(resolution);
    } else {
      this.resolutionService.createResolution(resolution);
    }

    this.isModalVisible = false;
  }

  changeStatus(resolution: Resolution, active: boolean): void {
    // this.categoryService.changeStatusCategory(category.id, active);
  }

  updateResolution(resolution: Resolution): void {
    if (resolution) {
      const index = this.resolutions.findIndex(c => c.id === resolution.id);

      const resolutions = [...this.resolutions];
      if (index >= 0) {

        if (!resolution.resolution_number) {
          resolution = {...resolutions[index]};
          resolution.status = !resolution.status;
          resolutions[index] = resolution;
          this.resolutionService.updateResolutions(resolutions);
        } else {
          resolutions[index] = resolution;
          this.resolutionService.updateResolutions(resolutions);
        }

      } else {
        resolutions.push(resolution);
        this.resolutionService.updateResolutions(resolutions);
      }
    }
  }

  setFormData(resolution: Resolution): void {
    this.resolutionForm.setValue({
      resolution_number: resolution.resolution_number ?? null,
      resolution_number_cu: resolution.resolution_number_cu ?? null,
      bill_type: resolution.bill_type ?? null,
      start_number: resolution.start_number ?? null,
      end_number: resolution.end_number ?? null,
    });
  }

  buildResolution(): Resolution {
    let date = new Date();
    const resolution: Resolution = this.resolutionForm.value;
    resolution.id = this.resolutionId;
    resolution.user_id = this.user.id;
    resolution.last_number = 0;
    resolution.status = true;
    resolution.created_date = this.utilitiesService.formatDate(date);

    return resolution;
  }

  compareInvoiceType(originalInvoiceType: string, selectedInvoiceType: string): boolean {
    if (originalInvoiceType == null || selectedInvoiceType == null) {
      return false;
    }

    return originalInvoiceType.toLowerCase().trim() === selectedInvoiceType.toLowerCase().trim();
  }

}
