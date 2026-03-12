export type UserRole = 'producer' | 'buyer' | 'transporter' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Publication {
  id: string;
  producer_id: string;
  producer_name?: string;
  product_name: string;
  price_per_kg: number;
  stock_kg: number;
  location_name: string;
  category?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Load {
  id: string;
  order_id: string;
  product_name: string;
  origin: string;
  destination: string;
  weight_kg: number;
  status: 'publicada' | 'asignada' | 'en_transito' | 'entregada';
  distance_km: number;
  transporter_id?: string;
  publication_id?: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  publication_id: string;
  product_name: string;
  quantity_kg: number;
  total_price: number;
  status: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado';
  created_at: string;
}

export interface Transaction {
  id: string;
  reference_id: string;
  amount: number;
  type: 'sale' | 'shipping';
  status: 'completed' | 'failed';
  created_at: string;
}
