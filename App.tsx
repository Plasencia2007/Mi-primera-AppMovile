import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Platform,
  StatusBar as RNStatusBar,
  View,
  Text,
  BackHandler,
  PanResponder,
  Dimensions
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

import { colors } from './src/theme';
import { Tag, FileText } from 'lucide-react-native';
import { LoginScreen } from './src/features/auth/screens/LoginScreen';
import { RegisterScreen } from './src/features/auth/screens/RegisterScreen';
import { CatalogScreen } from './src/features/catalog/screens/CatalogScreen';
import { ProductDetailScreen } from './src/features/catalog/screens/ProductDetailScreen';
import { CartScreen } from './src/features/cart/screens/CartScreen';
import { ProfileScreen } from './src/features/profile/screens/ProfileScreen';
import { OrdersScreen } from './src/features/profile/screens/OrdersScreen';
import { AddressesScreen } from './src/features/profile/screens/AddressesScreen';
import { PaymentMethodsScreen } from './src/features/payments/screens/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from './src/features/payments/screens/AddPaymentMethodScreen';
import { AddressFormScreen } from './src/features/profile/screens/AddressFormScreen';
import { SelectLocationScreen } from './src/features/profile/screens/SelectLocationScreen';
import { SecurityScreen } from './src/features/profile/screens/SecurityScreen';
import { ChangePasswordScreen } from './src/features/profile/screens/ChangePasswordScreen';
import { TwoFactorAuthScreen } from './src/features/profile/screens/TwoFactorAuthScreen';
import { VerificationScreen } from './src/features/profile/screens/VerificationScreen';
import { DeviceManagementScreen } from './src/features/profile/screens/DeviceManagementScreen';
import { HelpCenterScreen } from './src/features/profile/screens/HelpCenterScreen';
import { OffersScreen } from './src/features/catalog/screens/OffersScreen';
import { BottomNav, TabType } from './src/components/layout/BottomNav';
import { useAddresses } from './src/features/profile/store/useAddresses';

const { width } = Dimensions.get('window');

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER' | 'MAIN'>('LOGIN');
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewingCart, setIsViewingCart] = useState(false);
  const [profileSubScreen, setProfileSubScreen] = useState<'ROOT' | 'ORDERS' | 'ADDRESSES' | 'PAYMENTS' | 'ADD_PAYMENT' | 'EDIT_ADDRESS' | 'SELECT_LOCATION' | 'SECURITY' | 'CHANGE_PASSWORD' | 'TWO_FACTOR' | 'VERIFICATION' | 'DEVICE_MANAGEMENT' | 'HELP_CENTER' | 'TRACKING'>('ROOT');
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  // Use global address store
  const addresses = useAddresses((state) => state.addresses);
  const addAddress = useAddresses((state) => state.addAddress);
  const updateAddress = useAddresses((state) => state.updateAddress);
  const deleteAddress = useAddresses((state) => state.deleteAddress);
  const setSelectedAddress = useAddresses((state) => state.setSelectedAddress);

  // Use a ref for the back action to avoid stale closures in listeners
  const backActionRef = useRef<() => boolean>(() => false);

  useEffect(() => {
    backActionRef.current = () => {
      // 1. If viewing product, close it
      if (selectedProduct) {
        setSelectedProduct(null);
        return true;
      }

      // 2. If in cart, go back
      if (isViewingCart) {
        setIsViewingCart(false);
        return true;
      }

      // 3. Handle Profile sub-screens
      if (activeTab === 'CUENTA' && profileSubScreen !== 'ROOT') {
        if (profileSubScreen === 'ADD_PAYMENT') {
          setProfileSubScreen('PAYMENTS');
          setEditingPayment(null);
        } else if (profileSubScreen === 'EDIT_ADDRESS') {
          setProfileSubScreen('ADDRESSES');
          setEditingAddress(null);
        } else if (profileSubScreen === 'SELECT_LOCATION') {
          setProfileSubScreen('EDIT_ADDRESS');
        } else {
          setProfileSubScreen('ROOT');
        }
        return true;
      }

      // 4. Default behavior (close app)
      return false;
    };
  }, [selectedProduct, isViewingCart, activeTab, profileSubScreen]);

  useEffect(() => {
    const handleBack = () => backActionRef.current();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => backHandler.remove();
  }, []);

  // iOS-style swipe to back gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only trigger on iOS, starting from left edge, moving right
        return (
          Platform.OS === 'ios' &&
          evt.nativeEvent.pageX < 40 &&
          gestureState.dx > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 80) {
          backActionRef.current();
        }
      },
    })
  ).current;

  // Reset profile sub-screen when navigating away from CUENTA tab
  useEffect(() => {
    if (activeTab !== 'CUENTA' && profileSubScreen !== 'ROOT') {
      setProfileSubScreen('ROOT');
    }
  }, [activeTab]);

  if (!fontsLoaded) {
    return null;
  }

  // Handle Authentication flow
  if (!isAuthenticated) {
    if (currentScreen === 'REGISTER') {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <RegisterScreen 
              onRegister={() => {
                setIsAuthenticated(true);
                setCurrentScreen('MAIN');
              }}
              onGoToLogin={() => setCurrentScreen('LOGIN')}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <LoginScreen 
            onLogin={() => {
              setIsAuthenticated(true);
              setCurrentScreen('MAIN');
            }}
            onGoToRegister={() => setCurrentScreen('REGISTER')}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Handle Main Content flow
  const renderTabContent = () => {
    if (isViewingCart) {
      return (
        <CartScreen onBack={() => setIsViewingCart(false)} />
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
      case 'HOME':
        return (
          <CatalogScreen 
            onProductPress={(product) => setSelectedProduct(product)}
            onViewCart={() => setIsViewingCart(true)}
          />
        );
      case 'CUENTA':
        switch (profileSubScreen) {
          case 'ORDERS':
            return <OrdersScreen onBack={() => setProfileSubScreen('ROOT')} />;
          case 'ADDRESSES':
            return (
              <AddressesScreen 
                onBack={() => setProfileSubScreen('ROOT')} 
                addresses={addresses}
                onSelectAddress={(id) => {
                  setSelectedAddress(id);
                }}
                onDeleteAddress={(id) => {
                  deleteAddress(id);
                }}
                onAddAddress={() => {
                  setEditingAddress(null);
                  setProfileSubScreen('EDIT_ADDRESS');
                }}
                onEditAddress={(address) => {
                  setEditingAddress(address);
                  setProfileSubScreen('EDIT_ADDRESS');
                }}
              />
            );
          case 'PAYMENTS':
            return (
              <PaymentMethodsScreen 
                onBack={() => setProfileSubScreen('ROOT')} 
                onAddPayment={() => {
                  setEditingPayment(null);
                  setProfileSubScreen('ADD_PAYMENT');
                }}
                onEditPayment={(method) => {
                  setEditingPayment(method);
                  setProfileSubScreen('ADD_PAYMENT');
                }}
              />
            );
          case 'EDIT_ADDRESS':
            return (
              <AddressFormScreen 
                onBack={() => {
                  setEditingAddress(null);
                  setProfileSubScreen('ADDRESSES');
                }}
                addressToEdit={editingAddress}
                onSave={(updated: any) => {
                  if (editingAddress) {
                    // Update existing
                    updateAddress(editingAddress.id, updated);
                  } else {
                    // Add new
                    const newAddr = {
                      ...updated,
                      id: `addr_${Date.now()}`,
                      isDefault: false
                    };
                    addAddress(newAddr);
                  }
                  setEditingAddress(null);
                  setProfileSubScreen('ADDRESSES');
                }}
                onSelectOnMap={() => setProfileSubScreen('SELECT_LOCATION')}
              />
            );
          case 'SECURITY':
            return (
              <SecurityScreen 
                onBack={() => setProfileSubScreen('ROOT')} 
                onNavigateToChangePassword={() => setProfileSubScreen('CHANGE_PASSWORD')}
                onNavigateToTwoFactor={() => setProfileSubScreen('TWO_FACTOR')}
                onNavigateToDevices={() => setProfileSubScreen('DEVICE_MANAGEMENT')}
              />
            );
          case 'CHANGE_PASSWORD':
            return (
              <ChangePasswordScreen 
                onBack={() => setProfileSubScreen('SECURITY')} 
                onSuccess={() => setProfileSubScreen('SECURITY')}
              />
            );
          case 'TWO_FACTOR':
            return (
              <TwoFactorAuthScreen 
                onBack={() => setProfileSubScreen('SECURITY')} 
                onNavigateToVerification={() => setProfileSubScreen('VERIFICATION')}
              />
            );
          case 'VERIFICATION':
            return (
              <VerificationScreen 
                onBack={() => setProfileSubScreen('TWO_FACTOR')} 
                onSuccess={() => setProfileSubScreen('SECURITY')}
              />
            );
          case 'DEVICE_MANAGEMENT':
            return (
              <DeviceManagementScreen 
                onBack={() => setProfileSubScreen('SECURITY')} 
              />
            );
          case 'HELP_CENTER':
            return (
              <HelpCenterScreen 
                onBack={() => setProfileSubScreen('ROOT')} 
              />
            );
          case 'SELECT_LOCATION':
            return (
              <SelectLocationScreen 
                onBack={() => setProfileSubScreen('EDIT_ADDRESS')}
                onConfirm={(location) => {
                  setEditingAddress({...editingAddress, ...location});
                  setProfileSubScreen('EDIT_ADDRESS');
                }}
                initialAddress={editingAddress?.street}
              />
            );
          case 'ADD_PAYMENT':
            return (
              <AddPaymentMethodScreen 
                onBack={() => {
                  setEditingPayment(null);
                  setProfileSubScreen('PAYMENTS');
                }} 
                paymentToEdit={editingPayment}
              />
            );
          case 'TRACKING':
            return <OrdersScreen onBack={() => setProfileSubScreen('ROOT')} initialFilter="En camino" />;
          default:
            return (
              <ProfileScreen 
                onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentScreen('LOGIN');
                }} 
                onNavigateToOrders={() => setProfileSubScreen('ORDERS')}
                onNavigateToAddresses={() => setProfileSubScreen('ADDRESSES')}
                onNavigateToPayments={() => setProfileSubScreen('PAYMENTS')}
                onNavigateToSecurity={() => setProfileSubScreen('SECURITY')}
                onNavigateToHelp={() => setProfileSubScreen('HELP_CENTER')}
                onNavigateToTracking={() => setProfileSubScreen('TRACKING')}
              />
            );
        }
      case 'PEDIDOS':
        return <OrdersScreen onBack={() => setActiveTab('HOME')} />;
      case 'OFERTAS':
        return <OffersScreen />;
      default:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Sección en construcción</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View 
        style={{ flex: 1, backgroundColor: !isAuthenticated ? '#000000' : colors.white }}
        {...panResponder.panHandlers}
      >
        <StatusBar style={!isAuthenticated ? "light" : "dark"} translucent backgroundColor="transparent" />
        
        {!isAuthenticated ? (
          <View style={{ flex: 1 }}>
            {renderTabContent()}
          </View>
        ) : (
          <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={{ flex: 1 }}>
              {renderTabContent()}
            </View>
          </SafeAreaView>
        )}
        {!selectedProduct && !isViewingCart && (
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.white }}>
            <BottomNav 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </SafeAreaView>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
