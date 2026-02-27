export interface BillDetail {
  idSalesDetailsMigration: number;
  idDetalle: number;
  cantidad: number;
  descripcion: string;
  precio_Unitario: number;
  ventas_Excentas: number;
  ventas_Afectas: number;
  idCliente: number;
  idTotalFactura: number;
  ventas_No_Sujetas: number;
}
