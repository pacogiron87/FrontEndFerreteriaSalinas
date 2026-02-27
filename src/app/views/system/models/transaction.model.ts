export interface Transaction {
  active?: boolean;
  comment?: string;
  created_at?: string;
  end_balance?: number;
  end_date?: string;
  id: number;
  input_balance?: number;
  location_id?: number;
  location_name?: string;
  output_balance?: number;
  start_balance?: number;
  start_date?: string;
  status_balance?: string;
  total_balance?: number;
  update_at?: string;
  user_id?: string;
  user_name?: string;
}
