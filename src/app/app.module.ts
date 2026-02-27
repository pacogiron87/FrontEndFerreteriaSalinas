import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

// Módulos de la aplicación
import { AuthModule } from './views/auth/auth.module';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';

// Import routing module
import {AppRoutingModule} from './app-routing.module';

// Import app component
import {AppComponent} from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
} from '@coreui/angular';

import {IconModule, IconSetService} from '@coreui/icons-angular';

import {ConfirmationService, MessageService} from "primeng/api";


import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';

import {environment} from '../environments/environment';

import {ROOT_REDUCERS} from "./app.reducer";
import {metaReducers} from "./meta.reducer";
import {Effects} from "./core/store/effects/list";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS],
  imports: [
    AppRoutingModule,
    AuthModule,
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    EffectsModule.forRoot(Effects),
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    HttpClientModule,
    IconModule,
    ListGroupModule,
    ListGroupModule,
    NavModule,
    PerfectScrollbarModule,
    ProgressModule,
    ReactiveFormsModule,
    SharedModule,
    SidebarModule,
    SidebarModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    TabsModule,
    UtilitiesModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    ConfirmationService,
    IconSetService,
    MessageService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
