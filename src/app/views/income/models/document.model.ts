export interface Document {
  bill_number?: string;
  bill_type?: string|null;
  comment?: string;
  created_at?: string;
  id?: number;
  id_sale?: number;
  is_canceled?: boolean;
  is_valid_document?: boolean;
  resolution_number?: string;
  control_number?: string;
  resolution_number_cu?: string;
  status?: string;
  user_id?: string;
}
