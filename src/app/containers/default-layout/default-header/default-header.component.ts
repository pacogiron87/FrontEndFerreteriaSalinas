import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { HeaderComponent } from '@coreui/angular';

import { AuthService } from "src/app/core/services/auth.service";
import { User } from "src/app/views/system/models/user.model";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {
  @Input() sidebarId: string = "sidebar";
  user: User | null = null;
  subscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$().subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
    this.subscription.unsubscribe();
  }
  }

  logout(): void {
    this.authService.logout();
  }
}

