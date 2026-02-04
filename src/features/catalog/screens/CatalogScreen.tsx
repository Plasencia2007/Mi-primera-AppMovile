import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ShoppingBag } from "lucide-react-native";

import { colors, spacing } from "../../../theme";
import { Header } from "../../../components/layout/Header";
import { SearchBar } from "../components/SearchBar";
import { HeroSection } from "../components/HeroSection";
import { CategoryList } from "../components/CategoryList";
import { FeaturedSection } from "../components/FeaturedSection";
import { useCart } from "../../cart/store/useCart";
import { CartDrawer } from "../../../components/cart/CartDrawer";
import { supabase } from "../../../services/supabase";

interface CatalogScreenProps {
  onProductPress: (product: any) => void;
  onViewCart: () => void;
}

export const CatalogScreen = ({
  onProductPress,
  onViewCart,
}: CatalogScreenProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemCount = useCart((state) => state.getItemCount());
  const getTotal = useCart((state) => state.getTotal);

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const fetchCatalogData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Categories
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*");

      if (catError) throw catError;

      // Map to component format (adding icons for now)
      const mappedCategories = categoriesData.map(
        (cat: any, index: number) => ({
          id: cat.id,
          name: cat.name,
          icon:
            index === 0 ? "🍔" : index === 1 ? "🍕" : index === 2 ? "🥤" : "🍰",
          image: { uri: cat.image_url },
        }),
      );

      setCategories(mappedCategories);
      if (mappedCategories.length > 0)
        setActiveCategory(mappedCategories[0].id);

      // 2. Fetch Products
      const { data: productsData, error: prodError } = await supabase
        .from("products")
        .select("*");

      if (prodError) throw prodError;

      // Map to component format
      const mappedProducts = productsData.map((prod: any) => ({
        id: prod.id,
        name: prod.name,
        description: prod.description || "",
        price: prod.price.toString(),
        rating: "4.8", // Mocked for now
        time: "20-30 min", // Mocked for now
        image: { uri: prod.image_url },
        tag: "Popular",
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching catalog data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <FeaturedSection products={products} onProductPress={onProductPress} />
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
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flexDirection: "row",
    alignItems: "center",
  },
  countBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  countText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 12,
    color: colors.primary,
  },
  iconWrapper: {
    marginLeft: 12,
    marginRight: 12,
  },
  viewCartLabel: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: colors.white,
  },
  cartTotalText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: colors.white,
  },
});
