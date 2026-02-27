import {PurchaseDetail} from "./purchase-detail.model";


export interface Purchase {
  active?: boolean;
  billing_date?: string;
  code?: number;
  comment?: string;
  country?: string;
  created_at?: string;
  credit_note?: number;
  discount?: number;
  id?: number;
  invoice_format?: string;
  invoice_number?: number;
  invoiced?: string;
  location_id?: number;
  name?: string;
  order_date?: string;
  other_tax?: number;
  provider_id?: number;
  purchaseDetailModels?: PurchaseDetail[];
  purchaseDetailResponseModels?: PurchaseDetail[];
  total?: number;
  tradename?: string;
  updated_at?: string;
  user_id?: string;
}
