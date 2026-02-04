import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
} from "lucide-react-native";
import { colors } from "../../../theme";
import { useAdmin } from "../store/useAdmin";

interface AdminCustomerDetailScreenProps {
  customerId: string;
  onBack: () => void;
  onViewOrder?: (orderId: string) => void;
}

export const AdminCustomerDetailScreen = ({
  customerId,
  onBack,
  onViewOrder,
}: AdminCustomerDetailScreenProps) => {
  const insets = useSafeAreaInsets();
  const {
    selectedCustomerDetail: customer,
    isLoading,
    fetchCustomerDetail,
  } = useAdmin();

  useEffect(() => {
    fetchCustomerDetail(customerId);
  }, [customerId]);

  const formatMoney = (val: number) => {
    return val.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && !customer) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!customer) return null;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DETALLE DE CLIENTE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileMain}>
            <View style={styles.avatar}>
              {customer.avatar_url ? (
                <Image
                  source={{ uri: customer.avatar_url }}
                  style={styles.avatarImage}
                />
              ) : (
                <User size={32} color="#64748B" />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <View style={styles.infoRow}>
                <Mail size={14} color="#94A3B8" />
                <Text style={styles.infoText}>{customer.email}</Text>
              </View>
              {customer.phone && (
                <View style={styles.infoRow}>
                  <Phone size={14} color="#94A3B8" />
                  <Text style={styles.infoText}>{customer.phone}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>PEDIDOS</Text>
              <Text style={styles.statValue}>{customer.totalOrders}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>GASTO TOTAL</Text>
              <Text style={[styles.statValue, { color: "#10B981" }]}>
                {formatMoney(customer.totalSpent)}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: List of contents */}
        {/* Addresses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>DIRECCIONES SALVADAS</Text>
          </View>
          {customer.addresses.length > 0 ? (
            customer.addresses.map((addr: any) => (
              <View key={addr.id} style={styles.infoItem}>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>
                    {addr.title || "Dirección"}
                  </Text>
                  <Text style={styles.infoItemSubtitle}>
                    {addr.street}, {addr.district}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No hay direcciones registradas.
            </Text>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>MÉTODOS DE PAGO</Text>
          </View>
          {customer.paymentMethods.length > 0 ? (
            customer.paymentMethods.map((pm: any) => (
              <View key={pm.id} style={styles.infoItem}>
                <View
                  style={[
                    styles.paymentIcon,
                    {
                      backgroundColor:
                        pm.type === "Debit Card" ? "#EEF2FF" : "#FFF7ED",
                    },
                  ]}
                >
                  <CreditCard
                    size={18}
                    color={pm.type === "Debit Card" ? "#4F46E5" : "#EA580C"}
                  />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>
                    {pm.provider_name} •••• {pm.last_four}
                  </Text>
                  <Text style={styles.infoItemSubtitle}>{pm.type}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No hay métodos de pago registrados.
            </Text>
          )}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShoppingBag size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>PEDIDOS RECIENTES</Text>
          </View>
          {customer.orders.length > 0 ? (
            customer.orders.map((order: any) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItem}
                onPress={() => onViewOrder?.(order.id)}
              >
                <View style={styles.orderMain}>
                  <View>
                    <Text style={styles.orderId}># {order.id.slice(0, 8)}</Text>
                    <View style={styles.orderMeta}>
                      <Calendar size={12} color="#94A3B8" />
                      <Text style={styles.orderDate}>
                        {formatDate(order.created_at)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>
                      {formatMoney(Number(order.total_amount))}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(order.status) + "10",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(order.status) },
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Aún no ha realizado pedidos.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Entregado":
      return "#10B981";
    case "Pendiente":
      return "#F59E0B";
    case "Preparando":
      return "#6366F1";
    case "En camino":
      return "#0EA5E9";
    case "Cancelado":
      return "#EF4444";
    default:
      return "#94A3B8";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15, // Compact padding
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  profileMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  customerName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#1E293B",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: "#64748B",
    letterSpacing: 0.5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoItemContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#1E293B",
  },
  infoItemSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#94A3B8",
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  orderMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  orderDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#94A3B8",
  },
  orderRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  orderAmount: {
    fontFamily: "Outfit_700Bold",
    fontSize: 15,
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 10,
  },
});
