import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';

import { colors, spacing } from '../../../theme';
import { Header } from '../../../components/layout/Header';
import { SearchBar } from '../components/SearchBar';
import { HeroSection } from '../components/HeroSection';
import { CategoryList } from '../components/CategoryList';
import { FeaturedSection } from '../components/FeaturedSection';
import { CATALOG_MOCKS } from '../../../data/mocks/catalog.mocks';
import { useCart } from '../../cart/store/useCart';
import { CartDrawer } from '../../../components/cart/CartDrawer';

interface CatalogScreenProps {
  onProductPress: (product: any) => void;
  onViewCart: () => void;
}

export const CatalogScreen = ({ onProductPress, onViewCart }: CatalogScreenProps) => {
  const [activeCategory, setActiveCategory] = useState('1');
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());
  const getTotal = useCart((state) => state.getTotal);

  return (
    <View style={styles.container}>
      <Header onViewCart={onViewCart} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar />
        <HeroSection />
        <CategoryList 
          categories={CATALOG_MOCKS.CATEGORIES} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />
        <FeaturedSection 
          products={CATALOG_MOCKS.FEATURED_ITEMS} 
          onProductPress={onProductPress}
        />
      </ScrollView>

      {/* Floating Professional Cart Button */}
      {itemCount > 0 ? (
        <TouchableOpacity 
          style={styles.professionalCartBar} 
          onPress={() => setIsCartDrawerVisible(true)}
          activeOpacity={0.95}
        >
          <View style={styles.cartBarLeft}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{itemCount}</Text>
            </View>
            <View style={styles.iconWrapper}>
              <ShoppingBag size={20} color={colors.white} />
            </View>
            <Text style={styles.viewCartLabel}>Ver Carrito</Text>
          </View>
          <Text style={styles.cartTotalText}>S/ {getTotal().toFixed(2)}</Text>
        </TouchableOpacity>
      ) : null}

      {/* Cart Drawer */}
      <CartDrawer 
        visible={isCartDrawerVisible}
        onClose={() => setIsCartDrawerVisible(false)}
        onViewFullCart={() => {
          setIsCartDrawerVisible(false);
          onViewCart();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  professionalCartBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  countText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.primary,
  },
  iconWrapper: {
    marginLeft: 12,
    marginRight: 12,
  },
  viewCartLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  cartTotalText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 17,
    color: colors.white,
  },
});
