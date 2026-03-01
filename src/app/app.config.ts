import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// PrimeNG 21+ Modern Providers
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { definePreset } from '@primeng/themes';

const SakaiPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    }
  }
});

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
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation(), withViewTransitions()),
    provideHttpClient(),
    provideAnimationsAsync(),

    // Official PrimeNG 21 Initialization
    providePrimeNG({
      theme: {
        preset: SakaiPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
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
