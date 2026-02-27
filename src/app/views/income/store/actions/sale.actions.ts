import { createAction, props } from '@ngrx/store';

import { Sale } from 'src/app/views/income/models/sale.model';
import { EmailParameter } from '../../models/email-parameter.model';

export const getAllSales = createAction('[Sales] Get all sales');

export const searchSales = createAction(
  '[Sales] Search sales',
  props<{
    customerName: string;
    startDate: string;
    endDate: string;
    categoryName: number;
    location: number;
  }>()
);

export const searchSalesByCustomer = createAction(
  '[Sales] Search sales by customer',
  props<{ customerId: number }>()
);

export const getSalesSuccess = createAction(
  '[Sales] Get sales success',
  props<{ sales: Sale[] }>()
);

export const getFoundSalesSuccess = createAction(
  '[Sales] Get found sales success',
  props<{ foundSales: Sale[] }>()
);

export const getSalesByCustomerSuccess = createAction(
  '[Sales] Get sales by customer success',
  props<{ salesByCustomer: Sale[] }>()
);

export const addSale = createAction(
  '[Sales] Add sale',
  props<{ sale: Sale }>()
);
export const paySaleSuccess = createAction(
  '[Sales] Pay sale success',
  props<{ addedSale: Sale }>()
);
export const paySale = createAction(
  '[Sales] Pay sale',
  props<{ sale: Sale }>()
);
export const updateSales = createAction(
  '[Sales] Update sales',
  props<{ sales: Sale[] }>()
);

export const addSaleSuccess = createAction(
  '[Sales] Add sale success',
  props<{ addedSale: Sale }>()
);

export const saleFails = createAction(
  '[Sales] Sale fails',
  props<{ error: any }>()
);

export const addSaleInvoiceDte = createAction(
  '[Sales] Add sale invoice DTE',
  props<{ sale: Sale }>()
);

export const addSaleInvoiceSuccessDte = createAction(
  '[Sales] Add sale invoice success DTE',
  props<{ addedSale: Sale }>()
);

export const addSaleTaxCreditDte = createAction(
  '[Sales] Add sale tax credit DTE',
  props<{ sale: Sale }>()
);

export const addSaleTaxCreditSuccessDte = createAction(
  '[Sales] Add sale tax credit success DTE',
  props<{ addedSale: Sale }>()
);

export const addSendEmailDte = createAction(
  '[Sales] Add send email DTE',
  props<{ emailParameters: EmailParameter }>()
);

export const addSendEmailDteSuccess = createAction(
  '[Sales] Add send email success DTE',
  props<{ emailSent: boolean }>()
);