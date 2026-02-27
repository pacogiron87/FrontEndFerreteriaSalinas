import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.subscription = this.authService.isAuthenticated$().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/main']).then();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  login(): void {
    const userName = this.loginForm.get('name')?.value;
    const password = this.loginForm.get('password')?.value;

    if (userName && password) {
      this.authService.authenticate(userName, password);
    }
  }

  showHidePassword(): void {
    this.showPassword = !this.showPassword;
  }
}