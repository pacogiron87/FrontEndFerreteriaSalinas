import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
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
import { SelectModule } from 'primeng/select';

// Services
import { UserService } from "../services/user.service";
import { NotificationService } from "src/app/core/helpers/notification.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models & Enums
import { User, RoleType } from "../models/user.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users',
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
    SelectModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  public readonly utilitiesService = inject(UtilitiesService);

  readonly isModalVisible = signal(false);
  readonly userId = signal<string>('0');
  readonly userIsActive = signal(true);
  readonly modalTitle = signal('Agregar usuario');
  
  readonly allUsers = toSignal(this.userService.selectUsers(), { initialValue: [] });
  readonly loading = toSignal(this.userService.selectIsLoading(), { initialValue: false });

  readonly roles = [
    { label: 'Administrador', value: RoleType.ADMIN },
    { label: 'Miembro / Vendedor', value: RoleType.MEMBER }
  ];

  userForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void { this.userService.getUsers(); }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roles: [RoleType.MEMBER, [Validators.required]],
      password: ['', this.userId() === '0' ? [Validators.required, Validators.minLength(6)] : []],
    });
  }

  toggleModal(user?: User): void {
    if (user) {
      this.userId.set(user.id); this.userIsActive.set(user.active); this.modalTitle.set('Editar usuario');
      this.userForm.patchValue({ name: user.name, userName: user.userName || user.username, email: user.email, roles: user.roles || user.role });
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userId.set('0'); this.userIsActive.set(true); this.modalTitle.set('Agregar usuario');
      this.userForm.reset({ roles: RoleType.MEMBER });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
    this.isModalVisible.set(true);
  }

  saveChanges(): void {
    if (this.userForm.valid) {
      const val = this.userForm.value;
      const user: User = { ...val, id: this.userId(), active: this.userIsActive() };
      if (this.userId() !== '0') this.userService.updateUser(user);
      else this.userService.createUser(user);
      this.isModalVisible.set(false);
    }
  }

  changeStatus(user: User, active: boolean): void { this.userService.changeStatusUser(user.id, active); }
  handleModalChange(event: boolean): void { this.isModalVisible.set(event); if (!event) { this.userForm.reset(); this.userId.set('0'); } }
}
