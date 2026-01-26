import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react-native';
import { colors, spacing } from '../../theme';
import { useCart } from '../../features/cart/store/useCart';

const { width, height } = Dimensions.get('window');

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
  onViewFullCart: () => void;
}

export const CartDrawer = ({ visible, onClose, onViewFullCart }: CartDrawerProps) => {
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const getTotal = useCart((state) => state.getTotal);
  const getItemCount = useCart((state) => state.getItemCount);

  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconWrapper}>
                <ShoppingBag size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Mi Carrito</Text>
                <Text style={styles.headerSubtitle}>
                  {getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <ScrollView 
            style={styles.itemsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.itemsContent}
          >
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <ShoppingBag size={64} color={colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
                <Text style={styles.emptySubtitle}>
                  Agrega productos para comenzar tu pedido
                </Text>
              </View>
            ) : (
              items.map((item) => {
                const basePrice = parseFloat(item.price.replace('S/ ', ''));
                const extrasPrice = item.extras?.reduce((acc, extra) => {
                  return acc + parseFloat(extra.price.replace('+ S/ ', '').replace('+S/', '').replace('+', '').replace('S/', ''));
                }, 0) || 0;
                const itemTotal = (basePrice + extrasPrice) * item.quantity;

                return (
                  <View key={item.cartId} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      
                      {item.extras && item.extras.length > 0 && (
                        <View style={styles.extrasContainer}>
                          {item.extras.map((extra, idx) => (
                            <Text key={idx} style={styles.extraText} numberOfLines={1}>
                              + {extra.name}
                            </Text>
                          ))}
                        </View>
                      )}
                      
                      <View style={styles.itemFooter}>
                        <Text style={styles.itemPrice}>S/ {itemTotal.toFixed(2)}</Text>
                        
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.cartId, item.quantity - 1)}
                            style={styles.quantityButton}
                          >
                            <Minus size={16} color={colors.primary} strokeWidth={3} />
                          </TouchableOpacity>
                          
                          <Text style={styles.quantityText}>{item.quantity}</Text>
                          
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.cartId, item.quantity + 1)}
                            style={styles.quantityButton}
                          >
                            <Plus size={16} color={colors.primary} strokeWidth={3} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.cartId)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Footer */}
          {items.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>S/ {getTotal().toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => {
                  onClose();
                  onViewFullCart();
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.checkoutButtonText}>Ver Carrito Completo</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.text,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsContainer: {
    flex: 1,
  },
  itemsContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  extrasContainer: {
    marginBottom: 8,
  },
  extraText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    backgroundColor: colors.white,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: colors.text,
  },
  checkoutButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
  checkoutButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
});
