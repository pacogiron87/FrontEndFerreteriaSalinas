export interface Provider {
  id: number;
  code?: string;
  nit?: string;
  nrc: string;
  fiscal_name: string;
  tradename: string;
  address?: string;
  country: string;
  phone: string;
  mobile: string;
  contact_person: string;
  email?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
  bank_data?: string;
  image?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
