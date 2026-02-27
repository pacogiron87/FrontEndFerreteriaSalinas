export interface Resolution {
  id: number;
  resolution_number: string;
  resolution_number_cu: string;
  start_number: number;
  end_number: number;
  last_number?: number;
  status: boolean;
  created_date?: string;
  user_id: string;
  bill_type: string;
}
