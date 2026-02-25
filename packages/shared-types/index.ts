export interface User {
  id: number;
  name: string;
  email: string;
  role: "super-admin" | "admin";
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
}

export interface CartItem {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: string;
  menu_item?: MenuItem;
}

export interface Order {
  id: number;
  customer_name: string | null;
  table_number: string | null;
  customer_phone: string | null;
  status: 'pending' | 'cleared';
  total_price: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  cleared_by_admin?: User;
}

export interface AuditLogItem {
  id: number;
  user_id: number | null;
  action: 'created' | 'updated' | 'deleted';
  entity_type: string;
  entity_name: string;
  category_name: string | null;
  created_at: string;
  user?: User;
}
