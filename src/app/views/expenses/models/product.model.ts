import {Category} from "./category.model";
import {Location} from "./location.model";
import {Provider} from "src/app/views/system/models/provider.model";


export interface Product {
  id: number;
  brand_code?: string;
  company_code?: string;
  distributor_code?: string;
  internal_code?: string;
  barcode?: string;
  description: string;
  stock: number;
  minimum_stock: number;
  reservation?: number;
  cost: number;
  sale_price: number;
  wholesale_price?: number;
  discount?: number;
  image?: string;
  active: boolean;
  category_id: Category;
  provider_id: Provider;
  location_id: Location;
  created_at?: string;
  updated_at?: string;
  quantity: number;
  is_exempt_product?: boolean;
}
