import { create } from 'zustand';
import { supabase } from '../../../services/supabase';
import { Order, OrderStatus } from '../../../types/order.types';

export interface AdminOrder extends Order {
  customerName: string;
  customerPhone?: string;
  customerEmail: string;
  address: string;
  paymentMethod: string;
}

interface AdminStats {
  todaySales: number;
  activeOrders: number;
  completedToday: number;
}

interface AdminState {
  orders: AdminOrder[];
  stats: AdminStats;
  isLoading: boolean;
  fetchAdminOrders: () => Promise<void>;
  subscribeToOrders: () => () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  // Gestión de Productos
  fetchProducts: () => Promise<any[]>;
  saveProduct: (product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useAdmin = create<AdminState>((set, get) => ({
  orders: [],
  stats: {
    todaySales: 0,
    activeOrders: 0,
    completedToday: 0
  },
  isLoading: false,

  fetchAdminOrders: async () => {
    try {
      set({ isLoading: true });

      // 1. Traer solo los pedidos e ítems (esto no suele fallar)
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (image_url)
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // 2. Extraer IDs únicos de usuarios, direcciones y métodos de pago
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      const addressIds = [...new Set(ordersData.map(o => o.address_id).filter(Boolean))];
      const paymentIds = [...new Set(ordersData.map(o => o.payment_method_id).filter(Boolean))];

      // 3. Traer perfiles, direcciones y métodos de pago por separado
      const [profilesRes, addressesRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds),
        supabase.from("addresses").select("id, street, district, city").in("id", addressIds),
        supabase.from("payment_methods").select("id, type, provider_name, last_four").in("id", paymentIds)
      ]);

      // 4. Mapear y juntar todo manualmente (Brute Force para evitar PGRST200)
      const formattedOrders: AdminOrder[] = ordersData.map((order: any) => {
        const profile = profilesRes.data?.find(p => p.id === order.user_id);
        const address = addressesRes.data?.find(a => a.id === order.address_id);
        const payment = paymentsRes.data?.find(pm => pm.id === order.payment_method_id);
        
        const firstItem = order.order_items?.[0];
        const imageUrl = order.image_url || firstItem?.products?.image_url;

        return {
          id: order.id,
          date: order.created_at,
          total: `S/ ${Number(order.total_amount).toFixed(2)}`,
          status: order.status,
          image: imageUrl,
          customerName: profile?.full_name || "Cliente Desconocido",
          customerEmail: profile?.email || "",
          customerPhone: profile?.phone || "",
          address: address ? `${address.street}, ${address.district}` : "Recojo o no especificada",
          paymentMethod: payment ? `${payment.type} ${payment.last_four ? `****${payment.last_four}` : ''}` : "No especificado",
          items: order.order_items.map((item: any) => ({
            productId: item.product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: `S/ ${Number(item.unit_price).toFixed(2)}`,
            image: item.products?.image_url || item.product_image
          }))
        };
      });

      // Stats
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = formattedOrders.filter(o => o.date.startsWith(today));
      
      const stats: AdminStats = {
        todaySales: todayOrders.reduce((acc, o) => acc + parseFloat(o.total.replace('S/ ', '')), 0),
        activeOrders: formattedOrders.filter(o => ['Pendiente', 'En camino'].includes(o.status)).length,
        completedToday: todayOrders.filter(o => o.status === 'Entregado').length
      };

      set({ orders: formattedOrders, stats, isLoading: false });
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  subscribeToOrders: () => {
    const subscription = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        get().fetchAdminOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  fetchProducts: async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  },

  saveProduct: async (product) => {
    const { error } = await supabase.from('products').upsert(product);
    if (error) throw error;
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }
}));
