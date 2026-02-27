import {INavData} from '@coreui/angular';
import { RoleType } from '../../views/system/models/user.model';

export interface INavDataWithRoles extends INavData {
  roles?: RoleType[];
  children?: INavDataWithRoles[];
}

export const  navItems: INavDataWithRoles[] = [
  /* {
    name: 'Dashboard',
    url: '/main',
    icon: 'fa-solid fa-gauge-high',
    roles: [RoleType.ADMIN, RoleType.MEMBER]
  },*/
  {
    name: 'Operaciones',
    title: true
  },
  {
    name: 'Inventario',
    url: '/expenses',
    icon: 'fa-solid fa-cart-flatbed',
    children: [
      {
        name: 'Categorias',
        url: '/expenses/categories',
        icon: 'fa-solid fa-star',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        name: 'Localidades',
        url: '/expenses/locations',
        icon: 'fa-solid fa-location-dot',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        name: 'Productos',
        url: '/expenses/products',
        icon: 'fa-solid fa-store',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
/*      {
        name: 'Ordenes de compra',
        url: '/expenses/purchase-orders',
        icon: 'fa-solid fa-truck'
      },
      {
        name: 'Salidas',
        url: '/expenses/outputs',
        icon: 'fa-solid fa-piggy-bank',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        name: 'Compras',
        url: '/expenses/purchases',
        icon: 'fa-solid fa-basket-shopping',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },*/
    ]
  },
  {
    name: 'Facturación',
    url: '/income',
    icon: 'fa-solid fa-bag-shopping',
    children: [
      /*  {
        name: 'Cotizaciones',
        url: '/income/prices',
        icon: 'fa-solid fa-receipt',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
    {
        name: 'Ordenes de venta',
        url: '/income/sales-orders',
        icon: 'fa-solid fa-pen-to-square'
      },
      {
        name: 'Ventas',
        url: '/income/sales',
        icon: 'fa-solid fa-cart-shopping',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },*/
      {
        name: 'Ventas Electronicas',
        url: '/income/sales-electronic',
        icon: 'fa-solid fa-cart-shopping',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      /*{
        name: 'Cuentas por cobrar',
        url: '/income/accounts-receivable',
        icon: 'fa-solid fa-file-invoice-dollar',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
       {
        name: 'Nº de resolución',
        url: '/income/resolution',
        icon: 'fa-solid fa-hashtag',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },*/
    ]
  },
/*  {
    name: 'Cuentas',
    url: '/accounts',
    icon: 'fa-solid fa-wallet',
    children: [
      {
        name: 'Cuentas por cobrar',
        url: '/accounts/charges-to-collect',
        icon: 'fa-solid fa-money-bill-1-wave'
      },
      {
        name: 'Cuentas por pagar',
        url: '/accounts/debts-to-pay',
        icon: 'fa-solid fa-dollar-sign'
      },
    ]
  },*/
  {
    name: 'Sistema',
    icon: 'fa-solid fa-gear',
    url: '/system',
    children: [
      /*{
        name: 'Control de efectivo',
        url: '/system/transactions',
        icon: 'fa-solid fa-cash-register',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        name: 'Operaciones',
        url: '/system/transactions',
        icon: 'fa-solid fa-circle-dollar-to-slot'
      },*/
      {
        name: 'Clientes',
        url: '/system/customers',
        icon: 'fa-solid fa-users-gear',
        roles: [RoleType.ADMIN,RoleType.MEMBER]
      },
/*      {
        name: 'Agentes',
        url: '/system/agents',
        icon: 'fa-solid fa-user-secret'
      },*/
      {
        name: 'Proveedores',
        url: '/system/providers',
        icon: 'fa-solid fa-people-carry-box',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      /* {
        name: 'Usuarios',
        url: '/system/users',
        icon: 'fa-solid fa-user-group',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      },
      {
        name: 'Empresa',
        url: '/system/business',
        icon: 'fa-solid fa-store',
        roles: [RoleType.ADMIN, RoleType.MEMBER]
      }*/
    ]
  },
  {
    title: true,
    name: 'Reportes'
  },
 /*  {
    name: 'Inventario',
    url: '/reports/inventory',
    icon: 'fa-solid fa-warehouse'
  },
  {
    name: 'Compras',
    url: '/reports/purchases',
    icon: 'fa-solid fa-cart-flatbed'
  },*/
  {
    name: 'Ventas',
    url: '/reports/sales',
    icon: 'fa-solid fa-money-bill-trend-up'
  },
/*  {
    name: 'Abonos',
    url: '/reports/payments',
    icon: 'fa-solid fa-file-invoice-dollar'
  },
  {
    name: 'Cuentas por cobrar',
    url: '/reports/charges-to-collect',
    icon: 'fa-solid fa-sack-dollar'
  },
  {
    name: 'Cuentas por pagar',
    url: '/reports/debts-to-pay',
    icon: 'fa-solid fa-credit-card'
  },
  {
    name: 'Clientes',
    url: '/reports/customers',
    icon: 'fa-solid fa-users'
  },
  {
    name: 'Proveedores',
    url: '/reports/providers',
    icon: 'fa-solid fa-truck-fast'
  },*/
];
