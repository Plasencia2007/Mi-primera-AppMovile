import { create } from 'zustand';
import { OTHER_METHODS_MOCKS } from '../../../data/mocks/payment.mocks';
import { PaymentMethod, PaymentMethodType } from '../../../types/payment.types';
import { supabase } from '../../../services/supabase';

interface PaymentsState {
  methods: PaymentMethod[];
  otherMethods: any[];
  selectedMethodId: string | null;
  isLoading: boolean;
  fetchMethods: () => Promise<void>;
  addMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  updateMethod: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
  removeMethod: (id: string) => Promise<void>;
  setSelectedMethod: (id: string) => void;
  setPrimaryMethod: (id: string) => Promise<void>;
}

export const usePayments = create<PaymentsState>((set, get) => ({
  methods: [],
  otherMethods: OTHER_METHODS_MOCKS,
  selectedMethodId: null,
  isLoading: false,

  fetchMethods: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMethods: PaymentMethod[] = data.map(m => ({
        id: m.id,
        type: m.type as PaymentMethodType,
        title: m.type === 'VISA' || m.type === 'MASTERCARD' 
          ? `•••• ${m.last_four}` 
          : (m.type === 'YAPE' || m.type === 'PLIN' ? `${m.type} - ${m.phone_number}` : m.type),
        subtitle: m.type === 'VISA' || m.type === 'MASTERCARD' 
          ? `${m.provider_name} • Vence ${m.expiry_date}` 
          : m.owner_name,
        isPrimary: m.is_primary,
        details: {
          lastFour: m.last_four,
          expiryDate: m.expiry_date,
          phoneNumber: m.phone_number,
          ownerName: m.owner_name,
        }
      }));

      set({ 
        methods: formattedMethods,
        selectedMethodId: formattedMethods.find(m => m.isPrimary)?.id || formattedMethods[0]?.id || null,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      set({ isLoading: false });
    }
  },

  addMethod: async (methodData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: methodData.type,
          provider_name: methodData.type === 'VISA' || methodData.type === 'MASTERCARD' ? 'Tarjeta' : methodData.type,
          last_four: methodData.details.lastFour,
          expiry_date: methodData.details.expiryDate,
          phone_number: methodData.details.phoneNumber,
          owner_name: methodData.details.ownerName,
          is_primary: methodData.isPrimary || false,
        })
        .select()
        .single();

      if (error) throw error;

      await get().fetchMethods(); // Refresh list
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  updateMethod: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          last_four: updates.details?.lastFour,
          expiry_date: updates.details?.expiryDate,
          phone_number: updates.details?.phoneNumber,
          owner_name: updates.details?.ownerName,
          is_primary: updates.isPrimary,
        })
        .eq('id', id);

      if (error) throw error;
      await get().fetchMethods();
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },

  removeMethod: async (id) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({ 
        methods: state.methods.filter(m => m.id !== id) 
      }));
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  },

  setSelectedMethod: (id) => set({ 
    selectedMethodId: id 
  }),

  setPrimaryMethod: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('payment_methods')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;
      await get().fetchMethods();
    } catch (error) {
      console.error('Error setting primary method:', error);
    }
  },
}));
