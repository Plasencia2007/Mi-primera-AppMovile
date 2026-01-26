import { create } from 'zustand';
import { PAYMENT_MOCKS, OTHER_METHODS_MOCKS } from '../../../data/mocks/payment.mocks';
import { PaymentMethod, PaymentMethodType } from '../../../types/payment.types';

interface PaymentsState {
  methods: PaymentMethod[];
  otherMethods: any[];
  selectedMethodId: string | null;
  addMethod: (method: PaymentMethod) => void;
  updateMethod: (id: string, method: Partial<PaymentMethod>) => void;
  removeMethod: (id: string) => void;
  setSelectedMethod: (id: string) => void;
  setPrimaryMethod: (id: string) => void;
}

export const usePayments = create<PaymentsState>((set) => ({
  methods: PAYMENT_MOCKS,
  otherMethods: OTHER_METHODS_MOCKS,
  selectedMethodId: 'apple-pay', // Default based on user previous state

  addMethod: (method) => set((state) => ({ 
    methods: [...state.methods, method] 
  })),

  updateMethod: (id, updatedFields) => set((state) => ({
    methods: state.methods.map(m => m.id === id ? { ...m, ...updatedFields } : m)
  })),

  removeMethod: (id) => set((state) => ({ 
    methods: state.methods.filter(m => m.id !== id) 
  })),

  setSelectedMethod: (id) => set({ 
    selectedMethodId: id 
  }),

  setPrimaryMethod: (id) => set((state) => ({
    methods: state.methods.map(m => ({
      ...m,
      isPrimary: m.id === id
    }))
  })),
}));
