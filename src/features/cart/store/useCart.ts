import { create } from 'zustand';
export { CartState, CartItem, Extra } from '../../../types/cart.types';
import { CartState, CartItem, Extra } from '../../../types/cart.types';

export const useCart = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (product: any, quantity: number, extras: Extra[] = []) => {
    const { items } = get();
    
    // Generate a unique ID for this specific combination of product + extras
    const extrasKey = extras.length > 0 
      ? extras.map(e => e.id).sort().join('-') 
      : 'none';
    const cartId = `${product.id}-${extrasKey}`;

    const existingItem = items.find((item: CartItem) => item.cartId === cartId);

    if (existingItem) {
      set({
        items: items.map((item: CartItem) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { 
          ...product, 
          cartId, 
          quantity, 
          extras: extras.length > 0 ? extras : undefined 
        }],
      });
    }
  },

  removeItem: (cartId: string) => {
    set({
      items: get().items.filter((item: CartItem) => item.cartId !== cartId),
    });
  },

  updateQuantity: (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(cartId);
      return;
    }
    set({
      items: get().items.map((item: CartItem) =>
        item.cartId === cartId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((total: number, item: CartItem) => {
      const basePrice = parseFloat(item.price.replace('S/ ', ''));
      const extrasPrice = item.extras?.reduce((acc, extra) => {
        return acc + parseFloat(extra.price.replace('+ S/ ', '').replace('+S/', '').replace('+', '').replace('S/', ''));
      }, 0) || 0;
      
      return total + (basePrice + extrasPrice) * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
  },
}));
