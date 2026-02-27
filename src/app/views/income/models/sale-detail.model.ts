export interface SaleDetail {
  affected_sale: number;
  created_at?: string;
  description_item: string;
  discount: number;
  exception_sale: number;
  id: number;
  id_item: number;
  id_sale: number;
  location: number;
  non_tax_sale: number;
  quantity: number;
  unit_price: number;
  unit_price_non_tax?: number;
  updated_at?: string;
}
