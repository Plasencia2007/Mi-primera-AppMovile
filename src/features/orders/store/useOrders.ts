import { create } from 'zustand';
import { supabase } from '../../../services/supabase';
import { CartItem } from '../../cart/store/useCart';
import { Order, OrderItem } from '../../../types/order.types';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  placeOrder: (
    items: CartItem[],
    total: number,
    addressId: string,
    paymentMethodId: string,
    notes?: string
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  cancelOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  subscribeToOrders: () => () => void;
}

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders: Order[] = ordersData.map((order: any) => {
        const firstItem = order.order_items?.[0];
        const imageUrl = firstItem?.products?.image_url;

        return {
          id: order.id,
          date: order.created_at,
          total: `S/ ${order.total_amount.toFixed(2)}`,
          status: order.status,
          image: imageUrl, 
          items: order.order_items.map((item: any) => ({
            productId: item.product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: `S/ ${item.unit_price.toFixed(2)}`,
            image: item.products?.image_url
          }))
        };
      });

      set({ orders: formattedOrders, isLoading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ isLoading: false });
    }
  },

  placeOrder: async (items, total, addressId, paymentMethodId, notes = '') => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuario no autenticado');
      if (!addressId) throw new Error('Por favor selecciona una dirección de entrega');
      if (!paymentMethodId) throw new Error('Por favor selecciona un método de pago');

      // UUID verification helper
      const isUUID = (str: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(str);
      };

      // 1. Generate a Clean Order ID (ORD-XXXX)
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ORD-${randomSuffix}`;

      // 2. Insert into 'orders' table
      const orderPayload: any = {
        id: orderId,
        user_id: user.id,
        address_id: addressId,
        total_amount: total,
        status: 'Pendiente',
        notes: notes,
        image_url: items[0]?.image, // Guardamos la imagen del primer item como imagen del pedido
      };

      // Only send payment_method_id if it's a valid UUID
      if (isUUID(paymentMethodId)) {
        orderPayload.payment_method_id = paymentMethodId;
      } else {
        // If it's a mock/special method like 'apple-pay' or 'cash'
        orderPayload.payment_method_type = paymentMethodId; // Assuming we have this column or we just skip it
      }

      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload);

      if (orderError) throw orderError;

      // 3. Insert into 'order_items' table
      const orderItems = items.map(item => {
        const unitPrice = parseFloat(item.price.replace('S/ ', ''));
        return {
          order_id: orderId,
          product_id: item.id, // Guardamos el UUID completo (ahora sí permite guiones)
          product_name: item.name,
          quantity: item.quantity,
          unit_price: unitPrice,
          product_image: item.image, // Guardamos la imagen individual del producto
          selected_addons: item.extras || []
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Refresh orders list
      await get().fetchOrders();

      set({ isLoading: false });
      return { success: true, orderId };
    } catch (error: any) {
      console.error('Error placing order:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Cancelado' })
        .eq('id', orderId);

      if (error) throw error;

      await get().fetchOrders();
      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  subscribeToOrders: () => {
    const { data: { user } } = (supabase.auth as any).session?.() || { data: { user: null } };
    
    // We'll use a safer way to get user since we are in a store
    const subscription = supabase
      .channel('client-orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        get().fetchOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
}));
