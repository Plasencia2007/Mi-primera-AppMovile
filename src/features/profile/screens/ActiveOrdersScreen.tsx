import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  ChevronLeft,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "../../../theme";
import { useOrders } from "../../orders/store/useOrders";
import { Order } from "../../../types/order.types";

interface ActiveOrdersScreenProps {
  onBack: () => void;
  onTrackOrder: (order: Order) => void;
}

export const ActiveOrdersScreen = ({
  onBack,
  onTrackOrder,
}: ActiveOrdersScreenProps) => {
  const { orders, fetchOrders, isLoading } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(
    (order) => order.status === "Pendiente" || order.status === "En camino",
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#1e293b" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rastreo de Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>PEDIDOS ACTIVOS</Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loaderText}>Buscando pedidos activos...</Text>
          </View>
        ) : activeOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Package size={64} color="#CBD5E1" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No hay pedidos activos</Text>
            <Text style={styles.emptySubtitle}>
              Los pedidos que realices aparecerán aquí mientras se preparan o
              entregan.
            </Text>
          </View>
        ) : (
          activeOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              activeOpacity={0.9}
              onPress={() => onTrackOrder(order)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.statusBadge}>
                  <Clock size={14} color={colors.primary} />
                  <Text style={styles.statusText}>
                    {order.status === "Pendiente" ? "Preparando" : "En Camino"}
                  </Text>
                </View>
                <Text style={styles.orderId}>{order.id}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.mainInfo}>
                  <View style={styles.iconBox}>
                    <Truck size={24} color={colors.white} />
                  </View>
                  <View style={styles.textDetails}>
                    <Text style={styles.orderLabel}>Destino de entrega</Text>
                    <Text style={styles.orderValue} numberOfLines={1}>
                      Dirección predeterminada
                    </Text>
                  </View>
                </View>

                <View style={styles.itemsPreview}>
                  <Text style={styles.itemsList} numberOfLines={1}>
                    {order.items
                      .map((i) => `${i.quantity}x ${i.name}`)
                      .join(", ")}
                  </Text>
                </View>
              </View>

              <LinearGradient
                colors={[colors.primary, "#b80202"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.trackRibbon}
              >
                <View style={styles.ribbonContent}>
                  <MapPin size={16} color={colors.white} />
                  <Text style={styles.trackText}>IR AL MAPA EN VIVO</Text>
                </View>
                <ArrowRight size={18} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 10,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 20,
    marginLeft: 4,
  },
  loaderContainer: {
    paddingVertical: 100,
    alignItems: "center",
  },
  loaderText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#64748B",
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: "#1e293b",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  statusText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 12,
    color: colors.primary,
  },
  orderId: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#94a3b8",
  },
  cardBody: {
    padding: 20,
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textDetails: {
    flex: 1,
  },
  orderLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  orderValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1e293b",
  },
  itemsPreview: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
  },
  itemsList: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#64748b",
  },
  trackRibbon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  ribbonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackText: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
