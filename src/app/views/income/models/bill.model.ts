import {BillDetail} from "./bill-detail.model";

export interface Bill {
  name: string;
  businessName: string;
  commercialBusiness: string;
  idSalesMigration: number;
  idTotalFactura: number;
  suma: number;
  iva_Suma: number;
  sub_Total: number;
  iva_Retenido: number;
  total: number;
  numero_Resolucion: string;
  total_Letras: number;
  fecha: string;
  tipo_Factura: string;
  hora: string;
  ventas_Excentas: number;
  idCliente: number;
  iva_Percibido: number;
  ventas_No_Sujetas: number;
  numero_Correlativo: number;
  anulada: string;
  billingDetails: BillDetail[];
}
