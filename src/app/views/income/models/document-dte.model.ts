/**
 * Represents the document DTE model
 */
export interface DocumentDTE {
  id: number;
  customer_id: number;
  invoice_number: number;
  invoice_type: null;
  total_sale: number;
  tax_sale: number;
  sub_total_sale: number;
  tax_credit_sale: number;
  tax_reteined: number;
  invoice_total: number;
  number_resolution_tax: null;
  invoice_total_letters: null;
  exception_sale: number;
  tax_perceived: number;
  tax_non_credit_sale: number;
  advance_payment: null;
  balance_payment: null;
  date_delivery: null;
  invoice_status: null;
  is_invoice_detained: boolean;
  location_id: number;
  comment: null;
  active: boolean;
  user_id: null;
  is_pending: boolean;
  is_pending_pay: null;
  created_at: Date;
  date_pay: null;
  updated_at: Date;
  customer_reteined_tax: boolean;
  code_generation: null;
  date_emitter: null;
  number_credit_prev_id: number;
  saleDetails: null;
}
