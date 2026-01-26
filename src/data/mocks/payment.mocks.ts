import { Platform } from 'react-native';
import { PaymentMethod } from '../../types/payment.types';

export const PAYMENT_MOCKS: PaymentMethod[] = [
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
  {
    id: 'pay3',
    type: 'YAPE',
    title: '999 888 777',
    subtitle: 'Asociado a Jhonsons Plasencia',
    isPrimary: false,
    details: {
      phoneNumber: '999 888 777',
      ownerName: 'Jhonsons Plasencia'
    }
  },
  {
    id: 'pay4',
    type: 'PLIN',
    title: '999 888 777',
    subtitle: 'Asociado a Jhonsons Plasencia',
    isPrimary: false,
    details: {
      phoneNumber: '999 888 777',
      ownerName: 'Jhonsons Plasencia'
    }
  }
];

export const OTHER_METHODS_MOCKS: { id: string; type: any; title: string }[] = [
  { 
    id: Platform.OS === 'android' ? 'google-pay' : 'apple-pay', 
    type: Platform.OS === 'android' ? 'GOOGLE_PAY' : 'APPLE_PAY', 
    title: Platform.OS === 'android' ? 'Google Pay' : 'Apple Pay' 
  },
  { id: 'paypal', type: 'PAYPAL', title: 'PayPal' },
  { id: 'cash', type: 'CASH', title: 'Efectivo al recibir' },
];
