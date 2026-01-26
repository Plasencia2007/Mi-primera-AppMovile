import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { Tag, Clock, Flame, Star, ChevronRight, Percent } from 'lucide-react-native';
import { colors, spacing } from '../../../theme';

const { width } = Dimensions.get('window');

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: any;
  validUntil: string;
  category: 'popular' | 'new' | 'limited';
  originalPrice?: string;
  discountedPrice?: string;
}

const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    title: '2x1 en Burgers Premium',
    description: 'Lleva 2 hamburguesas premium por el precio de 1',
    discount: '50%',
    image: require('../../../../assets/images/burger.png'),
    validUntil: '31 Ene 2024',
    category: 'popular',
    originalPrice: 'S/ 90.00',
    discountedPrice: 'S/ 45.00',
  },
  {
    id: '2',
    title: 'Pizza Familiar + Bebida',
    description: 'Pizza familiar de tu elección + 1.5L de bebida gratis',
    discount: '30%',
    image: require('../../../../assets/images/pizza.png'),
    validUntil: '15 Feb 2024',
    category: 'new',
    originalPrice: 'S/ 65.00',
    discountedPrice: 'S/ 45.50',
  },
  {
    id: '3',
    title: 'Combo Sushi Deluxe',
    description: '40 piezas de sushi premium con descuento especial',
    discount: '25%',
    image: require('../../../../assets/images/sushi.png'),
    validUntil: '28 Ene 2024',
    category: 'limited',
    originalPrice: 'S/ 120.00',
    discountedPrice: 'S/ 90.00',
  },
];

export const OffersScreen = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | 'new' | 'limited'>('all');

  const filteredOffers = activeCategory === 'all'
    ? MOCK_OFFERS
    : MOCK_OFFERS.filter(offer => offer.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'popular':
        return <Flame size={16} color="#F59E0B" />;
      case 'new':
        return <Star size={16} color="#10B981" />;
      case 'limited':
        return <Clock size={16} color={colors.primary} />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'popular':
        return 'Popular';
      case 'new':
        return 'Nuevo';
      case 'limited':
        return 'Por Tiempo Limitado';
      default:
        return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'popular':
        return '#F59E0B';
      case 'new':
        return '#10B981';
      case 'limited':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'popular', label: 'Populares' },
    { id: 'new', label: 'Nuevas' },
    { id: 'limited', label: 'Limitadas' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Tag size={28} color={colors.primary} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.headerTitle}>OFERTAS ESPECIALES</Text>
            <Text style={styles.headerSubtitle}>Descuentos exclusivos para ti</Text>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.tab}
            onPress={() => setActiveCategory(cat.id as any)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeCategory === cat.id && styles.tabTextActive
            ]}>
              {cat.label}
            </Text>
            {activeCategory === cat.id && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Offers List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredOffers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Tag size={80} color="#E9ECEF" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No hay ofertas disponibles</Text>
            <Text style={styles.emptySubtitle}>
              Vuelve pronto para ver nuevas promociones
            </Text>
          </View>
        ) : (
          filteredOffers.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={styles.offerCard}
              activeOpacity={0.9}
            >
              {/* Discount Badge */}
              <View style={styles.discountBadge}>
                <Percent size={18} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.discountText}>{offer.discount}</Text>
              </View>

              {/* Category Badge */}
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(offer.category) }
              ]}>
                {getCategoryIcon(offer.category)}
                <Text style={styles.categoryBadgeText}>
                  {getCategoryLabel(offer.category)}
                </Text>
              </View>

              {/* Offer Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={offer.image}
                  style={styles.offerImage}
                  resizeMode="cover"
                />
              </View>

              {/* Offer Content */}
              <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDescription}>{offer.description}</Text>

                {/* Price Section */}
                {offer.originalPrice && offer.discountedPrice && (
                  <View style={styles.priceContainer}>
                    <View>
                      <Text style={styles.originalPrice}>{offer.originalPrice}</Text>
                      <Text style={styles.discountedPrice}>{offer.discountedPrice}</Text>
                    </View>
                    <View style={styles.validUntilContainer}>
                      <Clock size={14} color="#896163" />
                      <Text style={styles.validUntilText}>Hasta {offer.validUntil}</Text>
                    </View>
                  </View>
                )}

                {/* CTA Button */}
                <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                  <Text style={styles.ctaButtonText}>Aprovechar Oferta</Text>
                  <ChevronRight size={20} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: '#181111',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#896163',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#896163',
  },
  tabTextActive: {
    color: colors.primary,
    fontFamily: 'Outfit_700Bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollContent: {
    padding: 16,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  discountText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 2,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
    gap: 4,
  },
  categoryBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F8F9FA',
  },
  offerImage: {
    width: '100%',
    height: '100%',
  },
  offerContent: {
    padding: 20,
  },
  offerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: '#181111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  offerDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#896163',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  originalPrice: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#896163',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: colors.primary,
    letterSpacing: -1,
    marginTop: 4,
  },
  validUntilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validUntilText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#896163',
  },
  ctaButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: '#181111',
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#896163',
    marginTop: 8,
    textAlign: 'center',
  },
});
