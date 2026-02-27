import {SaleDetail} from "./sale-detail.model";


export interface Sale {
  active: boolean;
  advance_payment?: number;
  balance_payment?: number;
  business_name?: string;
  comment: string;
  commercial_business?: string;
  created_at?: string;
  customer_id: number;
  customer_name?: string;
  date_delivery?: string | null;
  date_pay?:string;
  exception_sale: number;
  id?: number;
  invoice_number: number;
  invoice_status: string;
  invoice_total: number;
  invoice_total_letters: string;
   invoice_type: string | null;
  is_invoice_detained?: boolean;
  is_pending:boolean;
  is_pending_pay?:string;
  location_id: number;
  location_name?: string;
  number_resolution_tax: string | null;
  saleDetails: SaleDetail[];
  sub_total_sale: number;
  tax_credit_sale: number;
  tax_non_credit_sale: number;
  tax_perceived: number;
  tax_reteined: number;
  tax_sale: number;
  total_sale: number;
  updated_at?: string;
  user_id: string;
  user_name?: string;
  control_number_dte?: string;
  code_generation_dte?: string;
  is_retry: boolean;
}
