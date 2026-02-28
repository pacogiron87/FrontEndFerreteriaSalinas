# Gemini Instructions: Billing System Admin (Angular)

This project is a professional Angular enterprise application designed as a billing and inventory management system (FrontEndFerreteriaSalinas). It utilizes CoreUI for its administrative interface and NgRx for robust state management.

## Project Overview

-   **Framework:** Angular 13.3.x
-   **UI Library:** CoreUI v4 (Angular version)
-   **Component Library:** PrimeNG
-   **State Management:** NgRx (Store, Effects, Selectors)
-   **Styling:** SCSS (feature-specific and global layouts)
-   **Key Integrations:**
    -   `jsbarcode` / `ngx-barcode6` for barcode generation.
    -   `jspdf` / `html2canvas` for PDF report generation.
    -   `dayjs` for date manipulation.
    -   `@auth0/angular-jwt` for authentication.

## Architecture

The project follows a modular structure:
-   `src/app/core/`: Contains singleton services, guards, interceptors, and the global store configuration.
-   `src/app/views/`: Feature-based modules (e.g., `income`, `expenses`, `system`, `reports`). Each feature typically contains its own components, models, and NgRx store slice.
-   `src/app/containers/`: Layout components (e.g., `DefaultLayout`).
-   `src/app/shared/`: Shared components like modals and common UI elements.

## Building and Running

### Development
-   **Start server:** `npm start` (runs `ng serve`)
-   **Build (Dev):** `npm run build:dev`
-   **Test:** `npm test`

### Production
-   **Build (Prod):** `npm run build`

## Development Conventions

### 1. State Management (NgRx)
-   Always use the feature-based store pattern.
-   Define Actions, Reducers, and Selectors within the feature folder (e.g., `src/app/views/feature/store/`).
-   Register feature reducers in `src/app/core/store/index.ts`.

### 2. API Communication
-   Use `ApiService` (`src/app/core/services/api.service.ts`) for all HTTP requests. It handles token validation and global error handling.
-   Backend URLs and configuration (like taxes) are managed in `src/environments/environment.ts`.

### 3. Routing and Security
-   Protected routes must use `AuthGuard` and, where applicable, `RoleGuard`.
-   Navigation items are configured in `src/app/containers/default-layout/_nav.ts`. Note that many items may be commented out; verify before enabling.

### 4. Code Style
-   The project uses SCSS for styling. Adhere to the existing structure in `src/scss/`.
-   Maintain strict typing (TypeScript) as configured in `tsconfig.json`.

## Key Files to Reference
-   `package.json`: Project dependencies and scripts.
-   `src/app/app-routing.module.ts`: Main application routes.
-   `src/app/core/store/index.ts`: Global state definition.
-   `src/app/containers/default-layout/_nav.ts`: Sidebar navigation configuration.
-   `src/environments/environment.ts`: API endpoints and business constants.
