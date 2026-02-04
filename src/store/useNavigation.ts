import { create } from 'zustand';
import { TabType } from '../components/layout/BottomNav';

export type ProfileSubScreen = 
  | "ROOT"
  | "ORDERS"
  | "ADDRESSES"
  | "PAYMENTS"
  | "ADD_PAYMENT"
  | "EDIT_ADDRESS"
  | "SELECT_LOCATION"
  | "SECURITY"
  | "CHANGE_PASSWORD"
  | "TWO_FACTOR"
  | "VERIFICATION"
  | "DEVICE_MANAGEMENT"
  | "HELP_CENTER"
  | "TRACKING"
  | "SCHEDULED_ORDERS"
  | "ACTIVE_ORDERS";

interface NavigationState {
  currentScreen: "LOGIN" | "REGISTER" | "MAIN";
  activeTab: TabType;
  selectedProduct: any | null;
  isViewingCart: boolean;
  isViewingCheckout: boolean;
  isViewingTracking: boolean;
  selectedOrderForTracking: any | null;
  navigationOrigin: "CART" | "CHECKOUT" | "PROFILE" | null;
  profileSubScreen: ProfileSubScreen;
  editingPayment: any | null;
  editingAddress: any | null;

  // Actions
  setCurrentScreen: (screen: "LOGIN" | "REGISTER" | "MAIN") => void;
  setActiveTab: (tab: TabType) => void;
  setSelectedProduct: (product: any | null) => void;
  setIsViewingCart: (isViewing: boolean) => void;
  setIsViewingCheckout: (isViewing: boolean) => void;
  setIsViewingTracking: (isViewing: boolean) => void;
  setSelectedOrderForTracking: (order: any | null) => void;
  setNavigationOrigin: (origin: "CART" | "CHECKOUT" | "PROFILE" | null) => void;
  setProfileSubScreen: (subScreen: ProfileSubScreen) => void;
  setEditingPayment: (payment: any | null) => void;
  setEditingAddress: (address: any | null) => void;
  
  // Helpers
  resetToMain: () => void;
  goBack: () => boolean; // Returns true if it handled back, false if it should exit
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: "LOGIN",
  activeTab: "HOME",
  selectedProduct: null,
  isViewingCart: false,
  isViewingCheckout: false,
  isViewingTracking: false,
  selectedOrderForTracking: null,
  navigationOrigin: null,
  profileSubScreen: "ROOT",
  editingPayment: null,
  editingAddress: null,

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setIsViewingCart: (isViewing) => set({ isViewingCart: isViewing }),
  setIsViewingCheckout: (isViewing) => set({ isViewingCheckout: isViewing }),
  setIsViewingTracking: (isViewing) => set({ isViewingTracking: isViewing }),
  setSelectedOrderForTracking: (order) => set({ selectedOrderForTracking: order }),
  setNavigationOrigin: (origin) => set({ navigationOrigin: origin }),
  setProfileSubScreen: (subScreen) => set({ profileSubScreen: subScreen }),
  setEditingPayment: (payment) => set({ editingPayment: payment }),
  setEditingAddress: (address) => set({ editingAddress: address }),

  resetToMain: () => set({
    selectedProduct: null,
    isViewingCart: false,
    isViewingCheckout: false,
    isViewingTracking: false,
    selectedOrderForTracking: null,
    navigationOrigin: null,
    profileSubScreen: "ROOT",
    editingPayment: null,
    editingAddress: null,
  }),

  goBack: () => {
    const state = get();

    if (state.selectedProduct) {
      set({ selectedProduct: null });
      return true;
    }

    if (state.isViewingTracking) {
      set({ isViewingTracking: false, selectedOrderForTracking: null });
      return true;
    }

    if (state.isViewingCheckout) {
      set({ isViewingCheckout: false });
      return true;
    }

    if (state.isViewingCart) {
      set({ isViewingCart: false });
      return true;
    }

    if (state.activeTab === "CUENTA" && state.profileSubScreen !== "ROOT") {
      if (state.profileSubScreen === "ADD_PAYMENT") {
        set({ profileSubScreen: "PAYMENTS", editingPayment: null });
      } else if (state.profileSubScreen === "EDIT_ADDRESS") {
        set({ profileSubScreen: "ADDRESSES", editingAddress: null });
      } else if (state.profileSubScreen === "SELECT_LOCATION") {
        set({ profileSubScreen: "EDIT_ADDRESS" });
      } else {
        if (state.navigationOrigin === "CHECKOUT") {
          set({ navigationOrigin: null, profileSubScreen: "ROOT", isViewingCart: true, isViewingCheckout: true });
        } else {
          set({ profileSubScreen: "ROOT" });
        }
      }
      return true;
    }

    if (state.activeTab !== "HOME") {
      set({ activeTab: "HOME" });
      return true;
    }

    return false;
  }
}));
