import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {LocationService} from "../services/location.service";
import {OutputService} from "../services/output.service";
import {OutputTypeRepository} from "../../../core/repositories/otuput-type.repository";
import {UserService} from "../../../views/system/services/user.service";
import {UtilitiesService} from "../../../core/helpers/utilities.service";

import {Output} from "../models/output.model";
import {StatusTypeData} from "../../../core/enums/status-type-data.enum";
import {User} from "../../../views/system/models/user.model";
import {Location} from "../models/location.model";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit, OnDestroy {
  // @ts-ignore
  outputForm: FormGroup;
  outputs: Output[] = [];
  outputId = 0;
  loading = false;
  isOutputActive = false;
  isSeeDetails = false;
  subscriptions: Subscription[] = [];
  locations: Location[] = [];
  // @ts-ignore
  user: User;
  statusTypeData = StatusTypeData;
  searchInformation = {
    startDate: null,
    endDate: null,
    location_id: null,
  };
  changeStatusInformation = {
    id: 0,
    status: false,
    comment: '',
    userId: '0',
  };
  outputTypes = OutputTypeRepository;

  constructor(
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private locationService: LocationService,
    private outputService: OutputService,
    private userService: UserService,
    public utilitiesService: UtilitiesService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.outputForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      comment: [null],
      description: [null, [Validators.required]],
      location: [null, [Validators.required]],
      receiver: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });

    this.outputService.searchOutputs(this.searchInformation);
    this.locationService.getLocations();
    this.subscriptions[0] = this.locationService.selectLocations().subscribe(locations => this.locations = locations);
    this.subscriptions[1] = this.outputService.selectChangeStatus().subscribe(output => this.updateOutputListFromChangeStatus(output));
    this.subscriptions[2] = this.outputService.selectFoundOutputs().subscribe(outputs => this.outputs = outputs);
    this.subscriptions[3] = this.outputService.selectLoading().subscribe(loading => this.loading = loading);
    this.subscriptions[4] = this.outputService.selectSavedOutput().subscribe(output => this.updateOutputsList(output));
    this.subscriptions[5] = this.userService.selectAuthenticateUser().subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  newOutput(): void {
    this.isOutputActive = true;
  }

  seeDetails(): void {
    this.isSeeDetails = true;
  }

  returnOutputsList(): void {
    this.isOutputActive = false;
    this.isSeeDetails = false;
    this.outputForm.reset();
  }

  updateOutputsList(output: Output): void {
    if (output) {
      const index = this.outputs.findIndex(o => o.id === output.id);

      const outputs = [...this.outputs];

      if (index >= 0) {
        outputs[index] = output;
      } else {
        outputs.push(output);
      }

      this.outputService.updateOutputs(outputs);
    }
  }

  updateOutputListFromChangeStatus(output: Output): void {
    if (output) {
      const index = this.outputs.findIndex(o => o.id === output.id);

      const outputs = [...this.outputs];

      if (index >= 0) {
        outputs[index].active = output.active;
      }

      this.outputService.updateOutputs(outputs);
    }
  }

  buildOutput(): Output {
    const date = new Date();
    const location = this.outputForm.controls['location'].value;
    const type = this.outputForm.controls['type'].value;

    return {
      active: true,
      amount_output: this.outputForm.controls['amount'].value,
      comment: this.outputForm.controls['comment'].value,
      created_at: this.utilitiesService.formatDate(date),
      description: this.outputForm.controls['description'].value,
      id: 0,
      location_id: location.id,
      output_receiver: this.outputForm.controls['receiver'].value,
      output_type: type.description,
      update_at: this.utilitiesService.formatDate(date),
      user_id: this.authService.currentUser!.id,
    }
  }

  completeOutput(): void {
    this.outputService.addOutput(this.buildOutput());
    this.returnOutputsList();
  }

  changeStatus(output: Output, active: boolean): void {
    this.changeStatusInformation.id = output.id;
    this.changeStatusInformation.status = active;
    this.changeStatusInformation.comment = 'test';
    this.changeStatusInformation.userId = this.authService.currentUser!.id;

    this.outputService.changeStatusOutput(this.changeStatusInformation);
  }

}
