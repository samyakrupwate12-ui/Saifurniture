export type StockStatus = "in_stock" | "out_of_stock" | "made_to_order";
export type EnquiryStatus = "new" | "in_progress" | "quoted" | "closed";
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";
export type AdminRole = "owner" | "admin" | "manager";

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  product_count?: number;
}

export interface DBProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  selling_price: number;
  original_price: number | null;
  category_id: string | null;
  material: string | null;
  dimensions: string | null;
  colour: string | null;
  stock_status: StockStatus;
  is_featured: boolean;
  is_published: boolean;
  is_archived: boolean;
  created_at?: string;
  updated_at?: string;
  category?: DBCategory | null;
  product_images?: DBProductImage[];
}

export interface DBAdminUser {
  id: string;
  user_id: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at?: string;
}

export interface DBEnquiry {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  product_id: string | null;
  quantity: number;
  message: string | null;
  status: EnquiryStatus;
  internal_notes: string | null;
  created_at: string;
  updated_at?: string;
  product?: DBProduct | null;
}

export interface DBQuotationItem {
  id?: string;
  quotation_id?: string;
  product_id: string | null;
  item_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface DBQuotation {
  id: string;
  quotation_number: string;
  enquiry_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  delivery_charge: number;
  total: number;
  valid_until: string | null;
  terms: string | null;
  status: QuotationStatus;
  created_at: string;
  updated_at?: string;
  quotation_items?: DBQuotationItem[];
  enquiry?: DBEnquiry | null;
}
