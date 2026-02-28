import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Standalone Components (IMPORTACIÓN DIRECTA PARA ESTABILIDAD EN V18/V21)
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { Password } from 'primeng/password';

// Services
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Card,
    InputText,
    Button,
    Toast,
    Ripple,
    Password
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;
  
  // Signals
  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly isAuthenticated = toSignal(this.authService.isAuthenticated$(), { initialValue: false });

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/income/sales-electronic']);
    }
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { name, password } = this.loginForm.value;
      this.authService.authenticate(name, password);
      setTimeout(() => this.isLoading.set(false), 1000);
    }
  }
}
