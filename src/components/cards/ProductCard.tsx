import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Star, Clock, Heart, Plus } from 'lucide-react-native';
import { colors, spacing } from '../../theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/IconButton';
import { Rating } from '../ui/Rating';
import { Product } from '../../types/catalog.types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <Card noPadding style={styles.card}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(product)}>
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
          <Badge 
            label={product.tag} 
            variant="dark" 
            style={styles.tagBadge} 
          />
          <IconButton 
            icon={<Heart size={18} color={colors.white} />} 
            variant="glass"
            size={32}
            style={styles.wishlistButton}
          />
        </View>
        
        <View style={styles.productDetails}>
          <View style={styles.productMainInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text numberOfLines={1} style={styles.productDesc}>{product.description}</Text>
          </View>
          
          <View style={styles.productStats}>
            <Rating value={parseFloat(product.rating)} size={14} showText />
            <View style={styles.statItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={styles.statText}>{product.time}</Text>
            </View>
          </View>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{product.price}</Text>
            <IconButton 
              icon={<Plus size={20} color={colors.white} />} 
              variant="primary"
              size={40}
              style={styles.addButton}
              onPress={() => onPress(product)}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  productDetails: {
    padding: spacing.md,
  },
  productMainInfo: {
    marginBottom: 12,
  },
  productName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  productDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  productStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom if card height varies
  },
  productPrice: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.text,
  },
  addButton: {
    borderRadius: 12,
    flexShrink: 0, // Prevent squashing on Android
  },
});
