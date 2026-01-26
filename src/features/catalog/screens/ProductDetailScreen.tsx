import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Dimensions,
  Animated,
  PanResponder
} from 'react-native';
import { ChevronLeft, Star, Clock, Minus, Plus, Heart, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing } from '../../../theme';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { Rating } from '../../../components/ui/Rating';
import { useCart, Extra } from '../../cart/store/useCart';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductDetailScreenProps {
  product: any;
  onBack: () => void;
}

const AVAILABLE_EXTRAS: Extra[] = [
  { id: 'ext1', name: 'Extra Queso Suizo', price: '+ S/ 1.50' },
  { id: 'ext2', name: 'Tocineta Ahumada', price: '+ S/ 2.00' },
  { id: 'ext3', name: 'Huevo Frito', price: '+ S/ 1.00' },
];

export const ProductDetailScreen = ({ product, onBack }: ProductDetailScreenProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const addItem = useCart((state: any) => state.addItem);

  // Gesture Logic
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.5],
    outputRange: [1, 0.5],
    extrapolate: 'clamp'
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only trigger if swiping down and not scrolling inside
        return gestureState.dy > 10 && Math.abs(gestureState.vx) < 2;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          // Dismiss
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(onBack);
        } else {
          // Reset
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const toggleExtra = (extra: Extra) => {
    if (selectedExtras.some(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedExtras);
    onBack();
  };

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(product.price.replace('S/ ', ''));
    const extrasPrice = selectedExtras.reduce((acc, extra) => {
      return acc + parseFloat(extra.price.replace('+ S/ ', ''));
    }, 0);
    return (basePrice + extrasPrice) * quantity;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY }], opacity }
      ]}
      {...panResponder.panHandlers}
    >
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header Image Section */}
        <View style={styles.imageHeader}>
          <Image source={product.image} style={styles.productImage} />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.topGradient}
          />

          <View style={styles.dragHandle} />

          <View style={styles.headerButtons}>
            <IconButton 
              icon={<ChevronLeft size={24} color={colors.text} />} 
              onPress={onBack}
              variant="glass"
              size={44}
            />
            <IconButton 
              icon={<Heart size={22} color={colors.white} />} 
              variant="glass"
              size={44}
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Badge label={product.tag} variant="secondary" style={styles.tagBadge} />
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <Rating 
              value={parseFloat(product.rating)} 
              showText 
              size={18} 
              style={styles.ratingContainer} 
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{product.time}</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.statText}>Envío Gratis</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Extras Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Añade Extras</Text>
            {AVAILABLE_EXTRAS.map((extra) => {
              const isActive = selectedExtras.some(e => e.id === extra.id);
              return (
                <TouchableOpacity 
                  key={extra.id} 
                  style={[styles.extraItem, isActive && styles.extraItemActive]}
                  onPress={() => toggleExtra(extra)}
                  activeOpacity={0.7}
                >
                  <View style={styles.extraLeft}>
                    <View style={[styles.checkbox, isActive && styles.checkboxActive]} />
                    <Text style={styles.extraName}>{extra.name}</Text>
                  </View>
                  <Text style={styles.extraPrice}>{extra.price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.footer}>
        <View style={styles.footerActions}>
          <View style={styles.professionalStepper}>
            <TouchableOpacity 
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.stepperSubBtn}
            >
              <Minus size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.stepperText}>{quantity}</Text>
            <TouchableOpacity 
              onPress={() => setQuantity(quantity + 1)}
              style={styles.stepperAddBtn}
            >
              <Plus size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.professionalAddBtn}
            onPress={handleAddToCart}
            activeOpacity={0.9}
          >
            <View style={styles.btnLeft}>
              <ShoppingBag size={20} color={colors.white} style={styles.btnIcon} />
              <Text style={styles.btnText}>Añadir</Text>
            </View>
            <View style={styles.btnDivider} />
            <Text style={styles.btnPrice}>S/ {calculateTotalPrice().toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageHeader: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  dragHandle: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 10,
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tagBadge: {
    marginBottom: 12,
  },
  productName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: colors.text,
  },
  ratingContainer: {
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 8,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#1A1D21',
    marginBottom: 16,
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  extraItemActive: {
    borderColor: colors.primary + '20',
    backgroundColor: colors.primary + '05',
  },
  extraLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  extraName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#344054',
  },
  extraPrice: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1A1D21',
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.lg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  professionalStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 30,
    padding: 4,
    width: 140,
    justifyContent: 'space-between',
  },
  stepperSubBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperAddBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stepperText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#1A1D21',
  },
  professionalAddBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 30,
    flex: 1,
    marginLeft: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  btnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  btnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  btnDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
  btnPrice: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
});
