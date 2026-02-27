import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {NotificationService} from "../../../core/helpers/notification.service";

import {User} from "../models/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // @ts-ignore
  userForm: FormGroup;
  users: User[] = [];
  user: User | undefined;

  loading = true;
  isModalVisible = false;
  modalTitle: string | undefined;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dui: [''],
      nit: [''],
      nrc: [''],
      commercialBusiness: [''],
      alias: [''],
      phoneHome: [''],
      mobile: [''],
      email: [''],
      country: [''],
      departmentAddress: [''],
      municipality: [''],
      businessName: [''],
    });
  }

  toggleModal(user: User | undefined = undefined): void {
    this.isModalVisible = !this.isModalVisible;

    if (user) {
      this.modalTitle = 'Editar usuario';
      /*this.user = user;
      const {name, description} = user;
      this.userForm.setValue({name, description});*/
    } else {
      this.modalTitle = 'Agregar usuario';
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.userForm.reset();
      /*this.user.id = 0;
      this.user.status = true;*/
    }
  }

  saveChanges(): void {
    this.loading = true;
    /*this.user.name = this.userForm.get('name')?.value;
    this.user.description = this.userForm.get('description')?.value;*/

    /*if (this.user.id > 0) {
      const index = this.categories.map(c => c.id).indexOf(this.user.id);
      this.categories[index] = {...this.user};
      this.notificationService.success('Se edito la categoria correctamente');
    } else {
      this.user.id = this.categories.length + 1;
      this.categories.push({...this.user});
      this.notificationService.success('Se agrego la categoria correctamente');
    }

    this.categories = [...this.categories];*/
    this.loading = false;
    this.isModalVisible = false;
  }

  changeStatus(user: User, active: boolean): void {
    this.loading = true;
    /*user.active = active;
    const index = this.categories.map(c => c.id).indexOf(user.id);
    this.categories[index] = {...user};*/
    this.loading = false;
    this.notificationService.success('Se cambio el estado correctamente');
  }

}
