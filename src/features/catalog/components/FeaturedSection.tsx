import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../../theme';
import { ProductCard } from '../../../components/cards/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  time: string;
  image: any;
  tag: string;
}

interface FeaturedSectionProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

export const FeaturedSection = ({ products, onProductPress }: FeaturedSectionProps) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recomendados para ti</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredList}>
        {products.map((item) => (
          <ProductCard key={item.id} product={item} onPress={onProductPress} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.text,
  },
  seeAllText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.primary,
  },
  featuredList: {
    paddingHorizontal: spacing.md,
  },
});
