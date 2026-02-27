// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
 urlApi: 'http://renegironsites-001-site6.btempurl.com/api',
  urlPdf: 'http://almacenessancarlos.tipografiacerna.com/documentsbilling/notaenvio',

  urlPdfDte: 'http://almacenessancarlos.tipografiacerna.com/dte/documents/dte',  
  urlDteLogs: 'http://almacenessancarlos.tipografiacerna.com/dte/documents/logs/',
  urlDteTkt: 'http://almacenessancarlos.tipografiacerna.com/dte/documents/tkt/',

  urlApiLogin: 'http://renegironsites-001-site16.jtempurl.com/login',
  tenantId: '6',
  hideFields: true,
  timeToCreateInvoice: 200,
  taxes: {
    tax: 13,
    taxWithHeld: 1,
    taxCollected: 1,
    minimumWithHoldingValue: 113,
  },
  currency: {
    singular: 'DOLAR',
    plural: 'DOLARES',
    centsSingular: 'CENTAVO',
    centsPlural: 'CENTAVOS',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
