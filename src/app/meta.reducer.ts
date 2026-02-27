import {ActionReducer, MetaReducer} from '@ngrx/store';
import {storeReset} from 'ngrx-store-reset';
import {localStorageSync} from 'ngrx-store-localstorage';

import {AppState} from "./core/store";

import * as fromCategories from './views/expenses/store/reducers/category.reducer';
import * as fromCustomers from './views/system/store/reducers/customer.reducer';
import * as fromCodeActivities from './views/system/store/reducers/codeActivities.reducer';
import * as fromDocuments from './views/income/store/reducers/document.reducer';
import * as fromLayout from './core/store/reducers/layout.reducer';
import * as fromLayoutActions from './core/store/actions/layout.actions';
import * as fromLocations from './views/expenses/store/reducers/location.reducer';
import * as fromMunicipalities from './views/system/store/reducers/municipality.reducer';
import * as fromOutputs from './views/expenses/store/reducers/output.reducer';
import * as fromPendingPayments from './views/income/store/reducers/accounts-receivable.reducer';
import * as fromProducts from './views/expenses/store/reducers/product.reducer';
import * as fromProviders from './views/system/store/reducers/provider.reducer';
import * as fromPurchases from './views/expenses/store/reducers/purchase.reducer';
import * as fromResolutions from './views/income/store/reducers/resolution.reducer';
import * as fromSales from './views/income/store/reducers/sale.reducer';
import * as fromSalesReport from './views/reports/store/reducers/sales.reducer';
import * as fromTransactions from './views/system/store/reducers/transaction.reducer';
import * as fromUsers from './views/system/store/reducers/user.reducer';


export const localStorageSyncReducer = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => localStorageSync({
  keys: [
    fromCategories.categoryFeatureKey,
    fromCustomers.customerFeatureKey,
    fromCodeActivities.codeActivitiesFeatureKey,
    fromDocuments.documentFeatureKey,
    fromLayout.layoutFeatureKey,
    fromLocations.locationFeatureKey,
    fromMunicipalities.municipalityFeatureKey,
    fromOutputs.outputFeatureKey,
    fromPendingPayments.paymentFeatureKey,
    fromProducts.productFeatureKey,
    fromProviders.providerFeatureKey,
    fromPurchases.purchaseFeatureKey,
    fromResolutions.resolutionFeatureKey,
    fromSales.saleFeatureKey,
    fromSalesReport.saleReportFeatureKey,
    fromTransactions.transactionFeatureKey,
    fromUsers.userFeatureKey,
  ],
  rehydrate: true,
})(reducer);

export const storeResetMetaReducer = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => storeReset({
  action: fromLayoutActions.closeSession.type
})(reducer);

export const metaReducers: MetaReducer<any>[] = [
  localStorageSyncReducer,
  storeResetMetaReducer,
];
