import { create } from 'zustand';
import { supabase } from '../../../services/supabase';
import { Order, OrderStatus } from '../../../types/order.types';
import { useNotification } from '../../../store/useNotification';

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
  weeklySales: number[];
  salesTrend: number;
  avgTicket: number;
  totalCustomers: number;
  topProducts: { name: string; quantity: number }[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  totalOrders: number;
  totalSpent: number;
}

export interface CustomerDetail extends AdminCustomer {
  orders: any[];
  addresses: any[];
  paymentMethods: any[];
}

interface AdminState {
  orders: AdminOrder[];
  customers: AdminCustomer[];
  selectedCustomerDetail: CustomerDetail | null;
  stats: AdminStats;
  isLoading: boolean;
  fetchAdminOrders: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  fetchCustomerDetail: (customerId: string) => Promise<void>;
  subscribeToOrders: () => () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  // Gestión de Productos
  fetchProducts: () => Promise<any[]>;
  saveProduct: (product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useAdmin = create<AdminState>((set, get) => ({
  orders: [],
  customers: [],
  selectedCustomerDetail: null,
  stats: {
    todaySales: 0,
    activeOrders: 0,
    completedToday: 0,
    weeklySales: [0, 0, 0, 0, 0, 0, 0],
    salesTrend: 0,
    avgTicket: 0,
    totalCustomers: 0,
    topProducts: [],
  },
  isLoading: false,

  fetchAdminOrders: async () => {
    try {
      set({ isLoading: true });

      // 1. Traer solo los pedidos e ítems
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

      // 2. Extraer IDs únicos
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      const addressIds = [...new Set(ordersData.map(o => o.address_id).filter(Boolean))];
      const paymentIds = [...new Set(ordersData.map(o => o.payment_method_id).filter(Boolean))];

      // 3. Traer datos relacionados
      const [profilesRes, addressesRes, paymentsRes, customerCountRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, phone, role").in("id", userIds),
        supabase.from("addresses").select("id, street, district, city").in("id", addressIds),
        supabase.from("payment_methods").select("id, type, provider_name, last_four").in("id", paymentIds),
        supabase.from("profiles").select("id", { count: 'exact', head: true }).neq('role', 'admin')
      ]);

      // 4. Mapear pedidos
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
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const todayOrders = formattedOrders.filter(o => o.date.startsWith(todayStr));
      
      // Weekly Performance Logic
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const weeklySales = last7Days.map(day => {
        return formattedOrders
          .filter(o => o.date.startsWith(day) && o.status !== 'Cancelado')
          .reduce((acc, o) => acc + parseFloat(o.total.replace('S/ ', '')), 0);
      });

      // Top Products Logic
      const productCounts: Record<string, number> = {};
      formattedOrders.forEach(order => {
        order.items.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productCounts)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);

      // Avg Ticket
      const deliveredOrders = formattedOrders.filter(o => o.status === 'Entregado');
      const avgTicket = deliveredOrders.length > 0
        ? deliveredOrders.reduce((acc, o) => acc + parseFloat(o.total.replace('S/ ', '')), 0) / deliveredOrders.length
        : 0;

      // Sales Trend Logic
      const yesterdaySales = weeklySales[5] || 0;
      const todaySales = weeklySales[6] || 0;
      const salesTrend = yesterdaySales > 0 
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 
        : 0;
      
      const stats: AdminStats = {
        todaySales: todaySales,
        activeOrders: formattedOrders.filter(o => ['Pendiente', 'Preparando', 'En camino'].includes(o.status)).length,
        completedToday: todayOrders.filter(o => o.status === 'Entregado').length,
        weeklySales,
        salesTrend,
        avgTicket,
        totalCustomers: customerCountRes.count || 0,
        topProducts
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload: any) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        const showNotification = useNotification.getState().showNotification;

        if (eventType === 'INSERT') {
          showNotification({
            type: 'info',
            title: '¡Nuevo Pedido!',
            message: `Ha llegado un nuevo pedido (#${newRecord.id.slice(0, 8)})`
          });
        } else if (eventType === 'UPDATE' && newRecord.status === 'Cancelado' && oldRecord.status !== 'Cancelado') {
          showNotification({
            type: 'warning',
            title: 'Pedido Cancelado',
            message: `El cliente ha cancelado el pedido #${newRecord.id.slice(0, 8)}`
          });
        }

        get().fetchAdminOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  fetchCustomers: async () => {
    try {
      set({ isLoading: true });
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('updated_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, status');

      if (ordersError) throw ordersError;

      const formattedCustomers: AdminCustomer[] = profiles.map(profile => {
        const userOrders = allOrders.filter(o => o.user_id === profile.id);
        const totalSpent = userOrders
          .filter(o => o.status === 'Entregado')
          .reduce((acc, o) => acc + Number(o.total_amount), 0);

        return {
          id: profile.id,
          name: profile.full_name || 'Sin Nombre',
          email: profile.email || '',
          phone: profile.phone || undefined,
          avatar_url: profile.avatar_url || undefined,
          created_at: profile.updated_at,
          totalOrders: userOrders.length,
          totalSpent
        };
      });

      set({ customers: formattedCustomers, isLoading: false });
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ isLoading: false });
    }
  },

  fetchCustomerDetail: async (customerId: string) => {
    try {
      if (!customerId) return;
      set({ isLoading: true, selectedCustomerDetail: null });
      
      console.log('Fetching detail for customer:', customerId);
      
      // Fetch basic profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (profileError) throw profileError;

      // Fetch related data
      const [ordersRes, addressesRes, paymentsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', customerId).order('created_at', { ascending: false }),
        supabase.from('addresses').select('*').eq('user_id', customerId),
        supabase.from('payment_methods').select('*').eq('user_id', customerId)
      ]);

      console.log('Customer Detail Query Results:', {
        ordersCount: ordersRes.data?.length || 0,
        addressesCount: addressesRes.data?.length || 0,
        paymentsCount: paymentsRes.data?.length || 0
      });

      const totalSpent = (ordersRes.data || [])
        .filter(o => o.status === 'Entregado')
        .reduce((acc, o) => acc + Number(o.total_amount), 0);

      const detail: CustomerDetail = {
        id: profile.id,
        name: profile.full_name || 'Sin Nombre',
        email: profile.email || '',
        phone: profile.phone || undefined,
        avatar_url: profile.avatar_url || undefined,
        created_at: profile.updated_at,
        totalOrders: (ordersRes.data || []).length,
        totalSpent,
        orders: ordersRes.data || [],
        addresses: addressesRes.data || [],
        paymentMethods: paymentsRes.data || []
      };

      set({ selectedCustomerDetail: detail, isLoading: false });
    } catch (error) {
      console.error('Error fetching customer detail:', error);
      set({ isLoading: false });
    }
  },

  fetchProducts: async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  },

  saveProduct: async (product) => {
    const { error } = await supabase.from('products').upsert(product);
    if (error) throw error;
    get().fetchAdminOrders();
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    get().fetchAdminOrders();
  }
}));
