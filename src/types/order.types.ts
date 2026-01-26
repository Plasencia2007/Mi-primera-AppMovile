export interface OrderItem {
  productId?: string;
  name: string;
  quantity: number;
  price: string;
}

export type OrderStatus = 'Entregado' | 'En camino' | 'Cancelado' | 'Pendiente';

export interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
}
