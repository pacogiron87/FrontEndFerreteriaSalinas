import {ActionReducerMap} from "@ngrx/store";

import * as fromCategories from 'src/app/views/expenses/store/reducers/category.reducer';
import * as fromCustomers from 'src/app/views/system/store/reducers/customer.reducer';
import * as fromCodeActivities from 'src/app/views/system/store/reducers/codeActivities.reducer';
import * as fromDocuments from 'src/app/views/income/store/reducers/document.reducer';
import * as fromLayout from './reducers/layout.reducer';
import * as fromLocations from 'src/app/views/expenses/store/reducers/location.reducer';
import * as fromMunicipalities from 'src/app/views/system/store/reducers/municipality.reducer';
import * as fromOutputs from 'src/app/views/expenses/store/reducers/output.reducer';
import * as fromPendingPayments from 'src/app/views/income/store/reducers/accounts-receivable.reducer';
import * as fromProducts from 'src/app/views/expenses/store/reducers/product.reducer';
import * as fromProviders from 'src/app/views/system/store/reducers/provider.reducer';
import * as fromPurchases from 'src/app/views/expenses/store/reducers/purchase.reducer';
import * as fromResolutions from 'src/app/views/income/store/reducers/resolution.reducer';
import * as fromSales from 'src/app/views/income/store/reducers/sale.reducer';
import * as fromSalesReport from 'src/app/views/reports/store/reducers/sales.reducer';
import * as fromTransactions from 'src/app/views/system/store/reducers/transaction.reducer';
import * as fromUsers from 'src/app/views/system/store/reducers/user.reducer';


export interface AppState {
  categories: fromCategories.State;
  customers: fromCustomers.State;
  codeActivities: fromCodeActivities.State;
  documents: fromDocuments.State;
  layout: fromLayout.State;
  locations: fromLocations.State;
  municipalities: fromMunicipalities.State;
  outputs: fromOutputs.State;
  payments: fromPendingPayments.State;
  products: fromProducts.State;
  providers: fromProviders.State;
  purchases: fromPurchases.State;
  resolutions: fromResolutions.State;
  sales: fromSales.State;
  salesReport: fromSalesReport.State;
  transactions: fromTransactions.State;
  users: fromUsers.State;
}

export const reducers: ActionReducerMap<AppState> = {
  categories: fromCategories.reducer,
  customers: fromCustomers.reducer,
  codeActivities: fromCodeActivities.reducer,
  documents: fromDocuments.reducer,
  layout: fromLayout.reducer,
  locations: fromLocations.reducer,
  municipalities: fromMunicipalities.reducer,
  outputs: fromOutputs.reducer,
  payments: fromPendingPayments.reducer,
  products: fromProducts.reducer,
  providers: fromProviders.reducer,
  purchases: fromPurchases.reducer,
  resolutions: fromResolutions.reducer,
  sales: fromSales.reducer,
  salesReport: fromSalesReport.reducer,
  transactions: fromTransactions.reducer,
  users: fromUsers.reducer,
}
