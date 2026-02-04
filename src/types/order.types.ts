export interface OrderItem {
  productId?: string;
  name: string;
  quantity: number;
  price: string;
  image?: any;
}

export type OrderStatus = 'Entregado' | 'En camino' | 'Cancelado' | 'Pendiente' | 'Preparando';

export interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
  image?: any;
}
