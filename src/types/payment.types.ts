export type PaymentMethodType = 'VISA' | 'MASTERCARD' | 'YAPE' | 'PLIN' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'PAYPAL' | 'CASH';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  subtitle?: string;
  isPrimary?: boolean;
  details: {
    lastFour?: string;
    expiryDate?: string;
    phoneNumber?: string;
    ownerName?: string;
  };
}

export interface PaymentState {
  methods: PaymentMethod[];
  selectedMethodId: string | null;
}
