export interface Extra {
  id: string;
  name: string;
  price: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  name: string;
  price: string;
  quantity: number;
  image: any;
  extras?: Extra[];
}

export interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity: number, extras?: Extra[]) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
