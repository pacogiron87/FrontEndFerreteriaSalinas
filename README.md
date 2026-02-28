
## Descripción
Este proyecto es una aplicación web desarrollada con Angular 21 que sirve como sistema de punto de venta (POS) y gestión administrativa para una ferretería. Incluye funcionalidades de ventas, inventario, clientes, proveedores, reportes y administración de usuarios.

## Características Principales

### Módulos
- **Core**: Autenticación, autorización y configuración global.
- **Dashboard**: Métricas y estadísticas del negocio.
- **Sales**: Gestión de ventas, facturación electrónica y devoluciones.
- **Inventory**: Administración de productos, categorías y existencias.
- **People**: Gestión de clientes, proveedores y empleados.
- **Reports**: Generación de reportes financieros y operativos.
- **Setup**: Configuración del sistema y usuarios.

### Funcionalidades Destacadas
- **Autenticación**: Inicio de sesión seguro con JWT.
- **Facturación Electrónica**: Generación de facturas electrónicas con validación de SRI.
- **Reportes**: Generación de reportes en PDF y Excel.
- **Responsive Design**: Interfaz adaptada para móviles y escritorio.
- **Temas**: Soporte para temas claros y oscuros.

## Requisitos Previos
- **Node.js**: v20.x o superior
- **npm**: v10.x o superior
- **Angular CLI**: v21.x

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd FrontEndFerreteriaSalinas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

## Ejecución

### Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run start
```
La aplicación estará disponible en `http://localhost:4200`.

### Build
Para generar una build de producción:
```bash
npm run build
```
Para una build de desarrollo:
```bash
npm run build:dev
```

## Estructura del Proyecto
```
FrontEndFerreteriaSalinas/
├── src/
│   ├── app/
│   │   ├── core/          # Core module (auth, guards, interceptors)
│   │   ├── features/        # Feature modules (sales, inventory, etc.)
│   │   ├── shared/          # Shared components and pipes
│   │   └── views/           # Application views
│   ├── assets/            # Static assets
│   ├── environments/      # Environment configurations
│   ├── scss/              # Stylesheets
│   └── services/          # Global services
├── package.json           # Project dependencies
└── angular.json           # Angular configuration
```

## Tecnologías Utilizadas
- **Framework**: Angular 21
- **UI Components**: PrimeNG v21
- **State Management**: NgRx
- **HTTP Client**: Angular HttpClient
- **Authentication**: @auth0/angular-jwt
- **Testing**: Jasmine, Karma

## Notas de Desarrollo
- El proyecto utiliza NgRx para el manejo del estado global.
- Se recomienda usar las variables de entorno definidas en `environments/`.
- Para desarrollo local, configurar las variables de entorno en `src/environments/environment.ts`.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, seguir las guías de contribución del proyecto.

## Licencia
Este proyecto es de código cerrado y propiedad de Ferretería Salinas.

## Contacto
Para soporte o consultas, contactar al equipo de desarrollo.
