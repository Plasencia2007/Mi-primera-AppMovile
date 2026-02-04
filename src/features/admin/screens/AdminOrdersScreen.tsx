import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  AlertButton,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  ArrowLeft,
  Filter,
  Search,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  DollarSign,
} from "lucide-react-native";
import { colors, spacing } from "../../../theme";
import { useAdmin, AdminOrder } from "../store/useAdmin";
import { OrderStatus } from "../../../types/order.types";

interface AdminOrdersScreenProps {
  onBack: () => void;
}

export const AdminOrdersScreen = ({ onBack }: AdminOrdersScreenProps) => {
  const { orders, fetchAdminOrders, updateOrderStatus, isLoading } = useAdmin();
  const [filter, setFilter] = useState<OrderStatus | "Todos">("Todos");

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const filteredOrders =
    filter === "Todos" ? orders : orders.filter((o) => o.status === filter);

  const handleUpdateStatus = (orderId: string, currentStatus: OrderStatus) => {
    const statuses: OrderStatus[] = [
      "Pendiente",
      "Preparando" as any,
      "En camino",
      "Entregado",
      "Cancelado",
    ];

    // In our types Preparando might not exist yet, let's stick to the ones we have or update types later
    // For now: Pendiente -> En camino -> Entregado
    const nextStatuses: OrderStatus[] = [
      "Pendiente",
      "En camino",
      "Entregado",
      "Cancelado",
    ];

    const buttons: AlertButton[] = nextStatuses.map((status) => ({
      text: status,
      onPress: () => updateOrderStatus(orderId, status),
      style: status === "Cancelado" ? "destructive" : "default",
    }));

    buttons.push({ text: "Cancelar", style: "cancel" });

    Alert.alert(
      "Actualizar Estado",
      "Selecciona el nuevo estado del pedido:",
      buttons,
    );
  };

  const StatusIcon = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case "Pendiente":
        return <Clock size={16} color="#F59E0B" />;
      case "En camino":
        return <Truck size={16} color={colors.primary} />;
      case "Entregado":
        return <CheckCircle2 size={16} color="#10B981" />;
      case "Cancelado":
        return <XCircle size={16} color="#EF4444" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GESTIÓN DE PEDIDOS</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {["Todos", "Pendiente", "En camino", "Entregado", "Cancelado"].map(
            (item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setFilter(item as any)}
                style={[styles.tab, filter === item && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabText,
                    filter === item && styles.activeTabText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.ordersList}
          contentContainerStyle={styles.ordersContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.date).toLocaleString("es-PE")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleUpdateStatus(order.id, order.status)}
                  style={[styles.statusBadge, styles[`status${order.status}`]]}
                >
                  <StatusIcon status={order.status} />
                  <Text
                    style={[styles.statusText, styles[`text${order.status}`]]}
                  >
                    {order.status}
                  </Text>
                  <ChevronDown
                    size={14}
                    color={
                      order.status === "Pendiente"
                        ? "#F59E0B"
                        : order.status === "Entregado"
                          ? "#10B981"
                          : order.status === "Cancelado"
                            ? "#EF4444"
                            : colors.primary
                    }
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.customerSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  <View style={styles.actionButtons}>
                    {order.customerPhone && (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(`tel:${order.customerPhone}`)
                          }
                          style={[
                            styles.smallActionBtn,
                            { backgroundColor: "#F0F9FF" },
                          ]}
                        >
                          <Phone size={14} color="#0EA5E9" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://wa.me/51${order.customerPhone}?text=Hola%20${order.customerName},%20somos%20de%20la%20tienda...`,
                            )
                          }
                          style={[
                            styles.smallActionBtn,
                            { backgroundColor: "#F0FDF4" },
                          ]}
                        >
                          <MessageSquare size={14} color="#22C55E" />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MapPin size={12} color="#64748B" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {order.address}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <DollarSign size={12} color="#64748B" />
                    <Text style={styles.detailText}>{order.paymentMethod}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.itemsSection}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemQty}>{item.quantity}x</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>TOTAL DEL PEDIDO</Text>
                <Text style={styles.totalValue}>{order.total}</Text>
              </View>
            </View>
          ))}

          {filteredOrders.length === 0 && (
            <View style={styles.emptyContainer}>
              <Package size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Sin pedidos</Text>
              <Text style={styles.emptySubtitle}>
                No se encontraron pedidos con este filtro.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tabsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F1F5F9",
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#64748B",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  orderDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusPendiente: { backgroundColor: "#FEF3C7" },
  statusEnCamino: { backgroundColor: colors.primary + "15" },
  statusEntregado: { backgroundColor: "#DCFCE7" },
  statusCancelado: { backgroundColor: "#FEE2E2" },
  statusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
  },
  textPendiente: { color: "#F59E0B" },
  textEnCamino: { color: colors.primary },
  textEntregado: { color: "#10B981" },
  textCancelado: { color: "#EF4444" },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 12,
  },
  customerSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerName: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 16,
    color: "#1E293B",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  smallActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsRow: {
    flexDirection: "column",
    gap: 4,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#64748B",
    flex: 1,
  },
  itemsSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemQty: {
    width: 30,
    fontFamily: "Outfit_700Bold",
    fontSize: 13,
    color: colors.primary,
  },
  itemName: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#334155",
  },
  itemPrice: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#334155",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 20,
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
});
