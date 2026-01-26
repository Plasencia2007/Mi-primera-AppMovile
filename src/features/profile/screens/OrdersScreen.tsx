import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Image 
} from 'react-native';
import { ChevronLeft, Package, MapPin, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react-native';
import { colors, spacing } from '../../../theme';
import { USER_MOCKS } from '../../../data/mocks/user.mocks';
import { Order, OrderStatus, OrderItem } from '../../../types/order.types';

interface OrdersScreenProps {
  onBack: () => void;
  initialFilter?: 'all' | OrderStatus;
}

export const OrdersScreen = ({ onBack, initialFilter = 'all' }: OrdersScreenProps) => {
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>(initialFilter);
  const orders = USER_MOCKS.orders;

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Entregado':
        return <CheckCircle2 size={20} color="#10B981" />;
      case 'En camino':
        return <Truck size={20} color={colors.primary} />;
      case 'Cancelado':
        return <XCircle size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#F59E0B" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Entregado':
        return '#10B981';
      case 'En camino':
        return colors.primary;
      case 'Cancelado':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const filters: Array<{ id: 'all' | OrderStatus; label: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'En camino', label: 'En Camino' },
    { id: 'Entregado', label: 'Entregados' },
    { id: 'Cancelado', label: 'Cancelados' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.primary} strokeWidth={3} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MIS PEDIDOS</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Tab Filters */}
      <View style={styles.tabsContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={styles.tab}
            onPress={() => setActiveFilter(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeFilter === filter.id && styles.tabTextActive
            ]}>
              {filter.label}
            </Text>
            {activeFilter === filter.id && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={80} color="#E9ECEF" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No hay pedidos</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'all' 
                ? 'Aún no has realizado ningún pedido' 
                : `No tienes pedidos ${activeFilter.toLowerCase()}`}
            </Text>
          </View>
        ) : (
          (filteredOrders as Order[]).map((order: Order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                  <View style={[
                    styles.statusIconWrapper,
                    { backgroundColor: getStatusColor(order.status) + '15' }
                  ]}>
                    {getStatusIcon(order.status)}
                  </View>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) }
                ]}>
                  <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.itemsContainer}>
                {order.items.map((item: OrderItem, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemQuantityBadge}>
                      <Text style={styles.itemQuantityText}>{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                ))}
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total del pedido</Text>
                  <Text style={styles.totalAmount}>{order.total}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.trackButton}
                    activeOpacity={0.8}
                  >
                    <MapPin size={18} color={colors.text} />
                    <Text style={styles.trackButtonText}>Rastrear</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.reorderButton}
                    activeOpacity={0.8}
                  >
                    <Package size={18} color={colors.white} />
                    <Text style={styles.reorderButtonText}>Pedir de Nuevo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
    backgroundColor: 'rgba(248, 246, 246, 0.8)',
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
    zIndex: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#181111',
    letterSpacing: -0.5,
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
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderId: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#181111',
    letterSpacing: -0.3,
  },
  orderDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#896163',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  itemsContainer: {
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemQuantityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemQuantityText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.primary,
  },
  itemName: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#181111',
  },
  itemPrice: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: '#896163',
  },
  orderFooter: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#896163',
  },
  totalAmount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6DBDC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  trackButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: '#181111',
    letterSpacing: 0.5,
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  reorderButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
