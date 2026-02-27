export const environment = {
  production: true,
  urlApi: 'http://145.223.120.187:6060/api',
  urlPdf: 'http://labsadonys.tipografiacerna.com/documentsbilling/notaenvio',
  urlPdfDte: 'http://145.223.120.187:6060/dte/',
   urlDteLogs: 'http://145.223.120.187:6060/logs/',
   urlDteTkt: 'http://145.223.120.187:6060/tkt/',
  urlApiLogin: 'http://renegironsites-001-site16.jtempurl.com/login',
  tenantId: '8',
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
