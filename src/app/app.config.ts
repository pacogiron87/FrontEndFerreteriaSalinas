import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// PrimeNG 21+ Modern Providers
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

// Routes
import { routes } from './app.routes';

// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ROOT_REDUCERS } from "./app.reducer";
import { metaReducers } from "./meta.reducer";
import { Effects } from "./core/store/effects/list";

// Shared Services
import { ConfirmationService, MessageService } from "primeng/api";
import { Title } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation(), withViewTransitions()),
    provideHttpClient(),
    provideAnimationsAsync(),
    
    // Official PrimeNG 21 Initialization
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.my-app-dark'
            }
        },
        ripple: true
    }),

    // NgRx Configuration
    provideStore(ROOT_REDUCERS, { 
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      }
    }),
    provideEffects(Effects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    }),

    // Shared Services
    ConfirmationService,
    MessageService,
    Title
  ]
};
