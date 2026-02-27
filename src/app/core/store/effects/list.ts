import {AccountsReceivableEffects} from "src/app/views/income/store/effects/accounts-receivable.effects";
import {CategoryEffects} from "src/app/views/expenses/store/effects/category.effects";
import {CustomerEffects} from "src/app/views/system/store/effects/customer.effects";
import {DocumentEffects} from "src/app/views/income/store/effects/document.effects";
import {LocationEffects} from "src/app/views/expenses/store/effects/location.effects";
import {MunicipalityEffects} from "src/app/views/system/store/effects/municipality.effects";
import {CodeActivitiesEffects} from "src/app/views/system/store/effects/codeActivities.effects";
import {OutputEffects} from "src/app/views/expenses/store/effects/output.effects";
import {ProductEffects} from "src/app/views/expenses/store/effects/product.effects";
import {ProviderEffects} from "src/app/views/system/store/effects/provider.effects";
import {PurchaseEffects} from "src/app/views/expenses/store/effects/purchase.effects";
import {ResolutionEffects} from "src/app/views/income/store/effects/resolution.effects";
import {SaleEffects} from "src/app/views/income/store/effects/sale.effects";
import {SaleReportEffects} from "src/app/views/reports/store/effects/sales-report.effects";
import {TransactionEffects} from "src/app/views/system/store/effects/transaction.effects";
import {UserEffects} from "src/app/views/system/store/effects/user.effects";


export const Effects: any[] = [
  AccountsReceivableEffects,
  CategoryEffects,
  CustomerEffects,
  DocumentEffects,
  LocationEffects,
  MunicipalityEffects,
  CodeActivitiesEffects,
  OutputEffects,
  ProductEffects,
  ProviderEffects,
  PurchaseEffects,
  ResolutionEffects,
  SaleEffects,
  SaleReportEffects,
  TransactionEffects,
  UserEffects,
]
