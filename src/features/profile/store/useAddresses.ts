import { create } from 'zustand';
import { Address } from '../../../types/address.types';
import { supabase } from '../../../services/supabase';

interface AddressState {
  addresses: Address[];
  selectedAddressId: string;
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setSelectedAddress: (id: string) => Promise<void>;
  getSelectedAddress: () => Address | undefined;
}

export const useAddresses = create<AddressState>((set, get) => ({
  addresses: [],
  selectedAddressId: '',
  isLoading: false,
  
  fetchAddresses: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAddresses: Address[] = data.map(addr => ({
        id: addr.id,
        title: addr.title,
        street: addr.street,
        district: addr.district,
        city: addr.city,
        interior: addr.interior,
        postalCode: addr.postal_code,
        isDefault: addr.is_default,
        latitude: addr.latitude,
        longitude: addr.longitude,
      }));

      set({ 
        addresses: formattedAddresses,
        selectedAddressId: formattedAddresses.find(a => a.isDefault)?.id || formattedAddresses[0]?.id || '',
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      set({ isLoading: false });
    }
  },
  
  addAddress: async (addressData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          title: addressData.title,
          street: addressData.street,
          district: addressData.district,
          city: addressData.city,
          interior: addressData.interior,
          postal_code: addressData.postalCode,
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          is_default: addressData.isDefault,
        })
        .select()
        .single();

      if (error) throw error;

      const newAddress: Address = {
        id: data.id,
        title: data.title,
        street: data.street,
        district: data.district,
        city: data.city,
        interior: data.interior,
        postalCode: data.postal_code,
        isDefault: data.is_default,
      };

      set((state) => ({
        addresses: [newAddress, ...state.addresses],
        selectedAddressId: newAddress.isDefault ? newAddress.id : state.selectedAddressId
      }));
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },
  
  updateAddress: async (id, updates) => {
    if (!id || id === 'undefined') {
      console.error('updateAddress: Invalid ID provided', id);
      return;
    }
    try {
      const { error } = await supabase
        .from('addresses')
        .update({
          title: updates.title,
          street: updates.street,
          district: updates.district,
          city: updates.city,
          interior: updates.interior,
          postal_code: updates.postalCode,
          latitude: updates.latitude,
          longitude: updates.longitude,
          is_default: updates.isDefault,
        })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === id ? { ...addr, ...updates } : addr
        ),
      }));
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },
  
  deleteAddress: async (id) => {
    if (!id || id === 'undefined') return;
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id),
        selectedAddressId: state.selectedAddressId === id ? '' : state.selectedAddressId
      }));
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },
  
  setSelectedAddress: async (id) => {
    if (!id || id === 'undefined') return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Set all to false in DB
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // 2. Set selected to true in DB
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        selectedAddressId: id,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      }));
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  },
  
  getSelectedAddress: () => {
    const state = get();
    return state.addresses.find((addr) => addr.id === state.selectedAddressId);
  },
}));
