import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../../theme';

interface Category {
  id: string;
  name: string;
  icon: string;
  image: any;
}

interface CategoryListProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryList = ({ categories, activeCategory, onSelectCategory }: CategoryListProps) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoriesList}
      >
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            onPress={() => onSelectCategory(cat.id)}
            style={[
              styles.categoryChip,
              activeCategory === cat.id ? styles.categoryChipActive : null
            ]}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryName,
              activeCategory === cat.id ? styles.categoryNameActive : null
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  categoriesList: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.text,
  },
  categoryNameActive: {
    color: colors.white,
  },
});
