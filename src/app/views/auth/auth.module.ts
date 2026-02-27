import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { ButtonModule, CardModule, FormModule, GridModule } from "@coreui/angular";

import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";

import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    LoginComponent,
    UnauthorizedComponent
  ],
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormModule,
    GridModule,
    ReactiveFormsModule,
    ToastModule,
    TooltipModule,
  ]
})
export class AuthModule { }
