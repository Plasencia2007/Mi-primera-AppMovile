import { UserProfile } from '../../types/user.types';
import { Address } from '../../types/address.types';
import { Order } from '../../types/order.types';
import { PaymentMethod } from '../../types/payment.types';

interface UserMocks {
  profile: UserProfile & { password?: string; phone?: string };
  addresses: Address[];
  orders: Order[];
  paymentMethods: PaymentMethod[];
  [key: string]: any;
}

export const USER_MOCKS: UserMocks = {
  profile: {
    id: 'u1',
    name: 'Jhonsons Plasencia',
    email: 'jhon@gmail.com',
    password: 'admin123',
    phone: '+51 987 654 321',
    avatar: require("../../../assets/images/user_avatar_pfp.png"),
    points: 450,
  },
  addresses: [
    {
      id: 'addr1',
      title: 'Casa',
      street: 'Av. Las Condes 1234',
      district: 'Miraflores',
      city: 'Lima',
      interior: 'Dpto 402',
      postalCode: '15047',
      isDefault: true,
    },
    {
      id: 'addr2',
      title: 'Trabajo',
      street: 'Calle Libertad 456',
      district: 'San Isidro',
      city: 'Lima',
      interior: 'Torre B, Of. 801',
      postalCode: '15046',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 'pay1',
      type: 'VISA',
      title: '•••• 4242',
      subtitle: 'Débito BCP • Vence 12/28',
      isPrimary: true,
      details: {
        lastFour: '4242',
        expiryDate: '12/28',
        ownerName: 'Jhonsons Plasencia'
      }
    },
    {
      id: 'pay2',
      type: 'MASTERCARD',
      title: '•••• 8899',
      subtitle: 'Crédito Interbank • Vence 09/25',
      isPrimary: false,
      details: {
        lastFour: '8899',
        expiryDate: '09/25',
        ownerName: 'Jhonsons Plasencia'
      }
    },
  ],
  orders: [
    {
      id: 'ORD-7721',
      date: '2024-01-20T14:30:00Z',
      total: 'S/ 83.00',
      status: 'Entregado',
      items: [
        { productId: 'f1', name: 'Truffle Dream Burger', quantity: 1, price: 'S/ 45.00' },
        { productId: 'f2', name: 'Pizza Margherita Royal', quantity: 1, price: 'S/ 38.00' },
      ],
    },
    {
      id: 'ORD-7722',
      date: '2024-01-25T12:00:00Z',
      total: 'S/ 125.00',
      status: 'En camino',
      items: [
        { productId: 'f3', name: 'Omakase Platter', quantity: 1, price: 'S/ 65.00' },
        { productId: 'f1', name: 'Truffle Dream Burger', quantity: 1, price: 'S/ 45.00' },
        { productId: 'f4', name: 'Coca Cola 1.5L', quantity: 1, price: 'S/ 15.00' },
      ],
    },
    {
      id: 'ORD-7605',
      date: '2024-01-15T20:15:00Z',
      total: 'S/ 65.00',
      status: 'Entregado',
      items: [
        { productId: 'f3', name: 'Omakase Platter', quantity: 1, price: 'S/ 65.00' },
      ],
    },
    {
      id: 'ORD-7580',
      date: '2024-01-10T18:45:00Z',
      total: 'S/ 52.00',
      status: 'Cancelado',
      items: [
        { productId: 'f2', name: 'Pizza Margherita Royal', quantity: 1, price: 'S/ 38.00' },
        { productId: 'f5', name: 'Ensalada César', quantity: 1, price: 'S/ 14.00' },
      ],
    },
  ],
  settings: {
    notifications: true,
    darkMode: false,
    language: 'es',
  }
};
