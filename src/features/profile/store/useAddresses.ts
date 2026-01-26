import { create } from 'zustand';
import { Address } from '../../../types/address.types';
import { USER_MOCKS } from '../../../data/mocks/user.mocks';

interface AddressState {
  addresses: Address[];
  selectedAddressId: string;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (id: string) => void;
  getSelectedAddress: () => Address | undefined;
}

export const useAddresses = create<AddressState>((set, get) => ({
  addresses: USER_MOCKS.addresses,
  selectedAddressId: USER_MOCKS.addresses.find(addr => addr.isDefault)?.id || USER_MOCKS.addresses[0]?.id || '',
  
  addAddress: (address: Address) => {
    set((state) => ({
      addresses: [...state.addresses, address],
    }));
  },
  
  updateAddress: (id: string, updates: Partial<Address>) => {
    set((state) => ({
      addresses: state.addresses.map((addr) =>
        addr.id === id ? { ...addr, ...updates } : addr
      ),
    }));
  },
  
  deleteAddress: (id: string) => {
    set((state) => ({
      addresses: state.addresses.filter((addr) => addr.id !== id),
    }));
  },
  
  setSelectedAddress: (id: string) => {
    set((state) => ({
      selectedAddressId: id,
      addresses: state.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    }));
  },
  
  getSelectedAddress: () => {
    const state = get();
    return state.addresses.find((addr) => addr.id === state.selectedAddressId);
  },
}));
