import { RoleType } from '../../views/system/models/user.model';
import { MenuItem } from 'primeng/api';

export interface AppMenuItem extends MenuItem {
  roles?: RoleType[];
  items?: AppMenuItem[];
}

export const navItems: AppMenuItem[] = [
  {
    label: 'Operaciones',
    separator: true
  },
  {
    label: 'Inventario',
    icon: 'pi pi-fw pi-box',
    roles: [RoleType.ADMIN, RoleType.MEMBER],
    items: [
      {
        label: 'Categorías',
        icon: 'pi pi-fw pi-tag',
        routerLink: '/expenses/categories',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        label: 'Localidades',
        icon: 'pi pi-fw pi-map-marker',
        routerLink: '/expenses/locations',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: '/expenses/products',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      }
    ]
  },
  {
    label: 'Facturación',
    icon: 'pi pi-fw pi-file-edit',
    roles: [RoleType.ADMIN, RoleType.MEMBER],
    items: [
      {
        label: 'Ventas Electrónicas',
        icon: 'pi pi-fw pi-send',
        routerLink: '/income/sales-electronic',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      }
    ]
  },
  {
    label: 'Sistema',
    icon: 'pi pi-fw pi-cog',
    roles: [RoleType.ADMIN, RoleType.MEMBER],
    items: [
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-users',
        routerLink: '/system/customers',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-fw pi-truck',
        routerLink: '/system/providers',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      }
    ]
  },
  {
    label: 'Reportes',
    separator: true
  },
  {
    label: 'Ventas',
    icon: 'pi pi-fw pi-chart-bar',
    routerLink: '/reports/sales',
    roles: [RoleType.ADMIN, RoleType.MEMBER]
  }
];
