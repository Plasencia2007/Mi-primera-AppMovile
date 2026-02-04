import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigationStore } from "../store/useNavigation";
import { useUser } from "../features/profile/store/useUser";
import { useAddresses } from "../features/profile/store/useAddresses";
import { usePayments } from "../features/payments/store/usePayments";
import { useNotification } from "../store/useNotification";
import { colors } from "../theme";

// Screens
import { CatalogScreen } from "../features/catalog/screens/CatalogScreen";
import { ProductDetailScreen } from "../features/catalog/screens/ProductDetailScreen";
import { CartScreen } from "../features/cart/screens/CartScreen";
import { CheckoutScreen } from "../features/cart/screens/CheckoutScreen";
import { ProfileScreen } from "../features/profile/screens/ProfileScreen";
import { OrdersScreen } from "../features/profile/screens/OrdersScreen";
import { OrderTrackingScreen } from "../features/orders/screens/OrderTrackingScreen";
import { AddressesScreen } from "../features/profile/screens/AddressesScreen";
import { PaymentMethodsScreen } from "../features/payments/screens/PaymentMethodsScreen";
import { AddPaymentMethodScreen } from "../features/payments/screens/AddPaymentMethodScreen";
import { AddressFormScreen } from "../features/profile/screens/AddressFormScreen";
import { SelectLocationScreen } from "../features/profile/screens/SelectLocationScreen";
import { SecurityScreen } from "../features/profile/screens/SecurityScreen";
import { ChangePasswordScreen } from "../features/profile/screens/ChangePasswordScreen";
import { TwoFactorAuthScreen } from "../features/profile/screens/TwoFactorAuthScreen";
import { VerificationScreen } from "../features/profile/screens/VerificationScreen";
import { DeviceManagementScreen } from "../features/profile/screens/DeviceManagementScreen";
import { HelpCenterScreen } from "../features/profile/screens/HelpCenterScreen";
import { OffersScreen } from "../features/catalog/screens/OffersScreen";
import { ScheduledOrdersScreen } from "../features/profile/screens/ScheduledOrdersScreen";
import { ActiveOrdersScreen } from "../features/profile/screens/ActiveOrdersScreen";

// Admin
import { AdminDashboard } from "../features/admin/screens/AdminDashboard";
import { AdminOrdersScreen } from "../features/admin/screens/AdminOrdersScreen";

interface MainNavigatorProps {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => void;
}

export const MainNavigator = ({
  handleLogout,
  handleDeleteAccount,
}: MainNavigatorProps) => {
  const {
    activeTab,
    setActiveTab,
    selectedProduct,
    setSelectedProduct,
    isViewingCart,
    setIsViewingCart,
    isViewingCheckout,
    setIsViewingCheckout,
    isViewingTracking,
    setIsViewingTracking,
    selectedOrderForTracking,
    setSelectedOrderForTracking,
    navigationOrigin,
    setNavigationOrigin,
    profileSubScreen,
    setProfileSubScreen,
    editingPayment,
    setEditingPayment,
    editingAddress,
    setEditingAddress,
  } = useNavigationStore();

  const {
    addresses,
    deleteAddress,
    setSelectedAddress,
    updateAddress,
    addAddress,
  } = useAddresses();
  const showNotification = useNotification((state) => state.showNotification);

  if (isViewingTracking && selectedOrderForTracking) {
    return (
      <OrderTrackingScreen
        order={selectedOrderForTracking}
        onBack={() => {
          setIsViewingTracking(false);
          setSelectedOrderForTracking(null);
        }}
      />
    );
  }

  if (isViewingCheckout) {
    return (
      <CheckoutScreen
        onBack={() => setIsViewingCheckout(false)}
        onOrderSuccess={(orderId) => {
          setIsViewingCheckout(false);
          setIsViewingCart(false);
          setActiveTab("PEDIDOS");
          showNotification({
            type: "success",
            title: "¡Pedido realizado!",
            message: `Tu pedido ${orderId} está siendo preparado.`,
          });
        }}
        onNavigateToAddresses={() => {
          setNavigationOrigin("CHECKOUT");
          setIsViewingCheckout(false);
          setIsViewingCart(false);
          setActiveTab("CUENTA");
          setProfileSubScreen("ADDRESSES");
        }}
        onNavigateToPayments={() => {
          setNavigationOrigin("CHECKOUT");
          setIsViewingCheckout(false);
          setIsViewingCart(false);
          setActiveTab("CUENTA");
          setProfileSubScreen("PAYMENTS");
        }}
      />
    );
  }

  if (isViewingCart) {
    return (
      <CartScreen
        onBack={() => setIsViewingCart(false)}
        onCheckout={() => setIsViewingCheckout(true)}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  switch (activeTab) {
    case "HOME":
      return (
        <CatalogScreen
          onProductPress={(product) => setSelectedProduct(product)}
          onViewCart={() => setIsViewingCart(true)}
        />
      );
    case "CUENTA":
      switch (profileSubScreen) {
        case "ORDERS":
          return (
            <OrdersScreen
              onBack={() => setProfileSubScreen("ROOT")}
              onTrackOrder={(order) => {
                setSelectedOrderForTracking(order);
                setIsViewingTracking(true);
              }}
              onReorder={() => {
                setIsViewingCart(true);
              }}
            />
          );
        case "ADDRESSES":
          return (
            <AddressesScreen
              onBack={() => {
                if (navigationOrigin === "CHECKOUT") {
                  setNavigationOrigin(null);
                  setProfileSubScreen("ROOT");
                  setIsViewingCart(true);
                  setIsViewingCheckout(true);
                } else {
                  setProfileSubScreen("ROOT");
                }
              }}
              addresses={addresses}
              onSelectAddress={(id) => {
                setSelectedAddress(id);
                if (navigationOrigin === "CHECKOUT") {
                  setNavigationOrigin(null);
                  setProfileSubScreen("ROOT");
                  setIsViewingCart(true);
                  setIsViewingCheckout(true);
                }
              }}
              onDeleteAddress={(id) => {
                deleteAddress(id);
              }}
              onAddAddress={() => {
                setEditingAddress(null);
                setProfileSubScreen("EDIT_ADDRESS");
              }}
              onEditAddress={(address) => {
                setEditingAddress(address);
                setProfileSubScreen("EDIT_ADDRESS");
              }}
            />
          );
        case "PAYMENTS":
          return (
            <PaymentMethodsScreen
              onBack={() => {
                if (navigationOrigin === "CHECKOUT") {
                  setNavigationOrigin(null);
                  setProfileSubScreen("ROOT");
                  setIsViewingCart(true);
                  setIsViewingCheckout(true);
                } else {
                  setProfileSubScreen("ROOT");
                }
              }}
              onAddPayment={() => {
                setEditingPayment(null);
                setProfileSubScreen("ADD_PAYMENT");
              }}
              onEditPayment={(method) => {
                setEditingPayment(method);
                setProfileSubScreen("ADD_PAYMENT");
              }}
              onSelectMethod={(id: string) => {
                usePayments.getState().setSelectedMethod(id);
                if (navigationOrigin === "CHECKOUT") {
                  setNavigationOrigin(null);
                  setProfileSubScreen("ROOT");
                  setIsViewingCart(true);
                  setIsViewingCheckout(true);
                }
              }}
            />
          );
        case "EDIT_ADDRESS":
          return (
            <AddressFormScreen
              onBack={() => {
                setEditingAddress(null);
                setProfileSubScreen("ADDRESSES");
              }}
              addressToEdit={editingAddress}
              onSave={async (updated: any) => {
                try {
                  if (editingAddress?.id) {
                    await updateAddress(editingAddress.id, updated);
                  } else {
                    await addAddress({
                      ...updated,
                      isDefault: addresses.length === 0,
                    });
                  }
                  setEditingAddress(null);
                  setProfileSubScreen("ADDRESSES");
                } catch (error: any) {
                  showNotification({
                    type: "error",
                    title: "Error",
                    message:
                      "No se pudo guardar la dirección: " + error.message,
                  });
                }
              }}
              onSelectOnMap={() => setProfileSubScreen("SELECT_LOCATION")}
            />
          );
        case "SECURITY":
          return (
            <SecurityScreen
              onBack={() => setProfileSubScreen("ROOT")}
              onNavigateToChangePassword={() =>
                setProfileSubScreen("CHANGE_PASSWORD")
              }
              onNavigateToTwoFactor={() => setProfileSubScreen("TWO_FACTOR")}
              onNavigateToDevices={() =>
                setProfileSubScreen("DEVICE_MANAGEMENT")
              }
            />
          );
        case "CHANGE_PASSWORD":
          return (
            <ChangePasswordScreen
              onBack={() => setProfileSubScreen("SECURITY")}
              onSuccess={() => setProfileSubScreen("SECURITY")}
            />
          );
        case "TWO_FACTOR":
          return (
            <TwoFactorAuthScreen
              onBack={() => setProfileSubScreen("SECURITY")}
              onNavigateToVerification={() =>
                setProfileSubScreen("VERIFICATION")
              }
            />
          );
        case "VERIFICATION":
          return (
            <VerificationScreen
              onBack={() => setProfileSubScreen("TWO_FACTOR")}
              onSuccess={() => setProfileSubScreen("SECURITY")}
            />
          );
        case "DEVICE_MANAGEMENT":
          return (
            <DeviceManagementScreen
              onBack={() => setProfileSubScreen("SECURITY")}
            />
          );
        case "HELP_CENTER":
          return (
            <HelpCenterScreen onBack={() => setProfileSubScreen("ROOT")} />
          );
        case "SELECT_LOCATION":
          return (
            <SelectLocationScreen
              onBack={() => setProfileSubScreen("EDIT_ADDRESS")}
              onConfirm={(location) => {
                setEditingAddress({ ...editingAddress, ...location });
                setProfileSubScreen("EDIT_ADDRESS");
              }}
              initialAddress={editingAddress?.street}
            />
          );
        case "ADD_PAYMENT":
          return (
            <AddPaymentMethodScreen
              onBack={() => {
                setEditingPayment(null);
                setProfileSubScreen("PAYMENTS");
              }}
              paymentToEdit={editingPayment}
            />
          );
        case "TRACKING":
          return (
            <OrdersScreen
              onBack={() => setProfileSubScreen("ROOT")}
              onTrackOrder={(order) => {
                setSelectedOrderForTracking(order);
                setIsViewingTracking(true);
              }}
              onReorder={() => {
                setIsViewingCart(true);
              }}
              initialFilter="En camino"
            />
          );
        case "SCHEDULED_ORDERS":
          return (
            <ScheduledOrdersScreen onBack={() => setProfileSubScreen("ROOT")} />
          );
        case "ACTIVE_ORDERS":
          return (
            <ActiveOrdersScreen
              onBack={() => setProfileSubScreen("ROOT")}
              onTrackOrder={(order) => {
                setSelectedOrderForTracking(order);
                setIsViewingTracking(true);
              }}
            />
          );
        case "ADMIN_DASHBOARD":
          return (
            <AdminDashboard
              onSelectOrder={() => setProfileSubScreen("ADMIN_ORDERS")}
              onViewAllOrders={() => setProfileSubScreen("ADMIN_ORDERS")}
              onNavigateToProducts={() => setProfileSubScreen("ADMIN_PRODUCTS")}
              onNavigateToOffers={() => setProfileSubScreen("ADMIN_OFFERS")}
            />
          );
        case "ADMIN_ORDERS":
          return (
            <AdminOrdersScreen
              onBack={() => setProfileSubScreen("ADMIN_DASHBOARD")}
            />
          );
        case "ADMIN_PRODUCTS":
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Pronto galería de productos...</Text>
              <TouchableOpacity
                onPress={() => setProfileSubScreen("ADMIN_DASHBOARD")}
              >
                <Text style={{ color: colors.primary, marginTop: 20 }}>
                  Volver
                </Text>
              </TouchableOpacity>
            </View>
          );
        case "ADMIN_OFFERS":
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Pronto panel de ofertas...</Text>
              <TouchableOpacity
                onPress={() => setProfileSubScreen("ADMIN_DASHBOARD")}
              >
                <Text style={{ color: colors.primary, marginTop: 20 }}>
                  Volver
                </Text>
              </TouchableOpacity>
            </View>
          );
        default:
          return (
            <ProfileScreen
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              onNavigateToOrders={() => setProfileSubScreen("ORDERS")}
              onNavigateToAddresses={() => setProfileSubScreen("ADDRESSES")}
              onNavigateToPayments={() => setProfileSubScreen("PAYMENTS")}
              onNavigateToSecurity={() => setProfileSubScreen("SECURITY")}
              onNavigateToHelp={() => setProfileSubScreen("HELP_CENTER")}
              onNavigateToActiveOrders={() =>
                setProfileSubScreen("ACTIVE_ORDERS")
              }
              onNavigateToScheduled={() =>
                setProfileSubScreen("SCHEDULED_ORDERS")
              }
              onNavigateToAdmin={() => setProfileSubScreen("ADMIN_DASHBOARD")}
            />
          );
      }
    case "PEDIDOS":
      return (
        <OrdersScreen
          onBack={() => setActiveTab("HOME")}
          onTrackOrder={(order) => {
            setSelectedOrderForTracking(order);
            setIsViewingTracking(true);
          }}
          onReorder={() => {
            setIsViewingCart(true);
          }}
        />
      );
    case "OFERTAS":
      return <OffersScreen />;
    default:
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Sección en construcción</Text>
        </View>
      );
  }
};
