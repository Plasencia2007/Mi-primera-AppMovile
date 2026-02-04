import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Package,
  DollarSign,
  Users,
  LayoutDashboard,
  PlusCircle,
  Tag,
  ArrowUpRight,
} from "lucide-react-native";
import { colors, spacing } from "../../../theme";
import { useAdmin, AdminOrder } from "../store/useAdmin";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface AdminDashboardProps {
  onSelectOrder: (order: AdminOrder) => void;
  onViewAllOrders: () => void;
  onNavigateToProducts: () => void;
  onNavigateToOffers: () => void;
}

export const AdminDashboard = ({
  onSelectOrder,
  onViewAllOrders,
  onNavigateToProducts,
  onNavigateToOffers,
}: AdminDashboardProps) => {
  const { orders, stats, isLoading, fetchAdminOrders, subscribeToOrders } =
    useAdmin();

  useEffect(() => {
    fetchAdminOrders();
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, []);

  const recentOrders = orders.slice(0, 4);

  const SalesChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Rendimiento de Ventas</Text>
        <View style={styles.trendBadge}>
          <ArrowUpRight size={14} color="#10B981" />
          <Text style={styles.trendText}>+12.5%</Text>
        </View>
      </View>
      <View style={styles.barChart}>
        {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
          <View key={i} style={styles.barWrapper}>
            <LinearGradient
              colors={
                i === 6 ? [colors.primary, "#910000"] : ["#E2E8F0", "#CBD5E1"]
              }
              style={[styles.bar, { height: height * 0.8 }]}
            />
            <Text style={styles.barLabel}>
              {["L", "M", "M", "J", "V", "S", "D"][i]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchAdminOrders}
          tintColor={colors.primary}
        />
      }
    >
      {/* Premium Header */}
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Panel de Control</Text>
            <Text style={styles.adminName}>ADMIN ESTATAL</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <LayoutDashboard color="#FFFFFF" size={20} />
            <View style={styles.activeDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.mainStatsRow}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatLabel}>VENTAS TOTALES</Text>
            <Text style={styles.mainStatValue}>
              S/ {stats.todaySales.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.mainStat}>
            <Text style={styles.mainStatLabel}>PEDIDOS HOY</Text>
            <Text style={styles.mainStatValue}>{orders.length}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Insights */}
        <SalesChart />

        <View style={styles.statsGrid}>
          <View style={[styles.statItem, { backgroundColor: "#ECFDF5" }]}>
            <CheckCircle2 color="#10B981" size={20} />
            <View>
              <Text style={styles.statItemValue}>{stats.completedToday}</Text>
              <Text style={styles.statItemLabel}>Entregados</Text>
            </View>
          </View>
          <View style={[styles.statItem, { backgroundColor: "#FFF7ED" }]}>
            <Clock color="#F59E0B" size={20} />
            <View>
              <Text style={styles.statItemValue}>{stats.activeOrders}</Text>
              <Text style={styles.statItemLabel}>En Proceso</Text>
            </View>
          </View>
        </View>

        {/* Management Section */}
        <Text style={styles.sectionTitle}>GESTIÓN RÁPIDA</Text>
        <View style={styles.managementRow}>
          <TouchableOpacity
            style={[styles.mgmtCard, { backgroundColor: "#F0F9FF" }]}
            onPress={onNavigateToProducts}
          >
            <View style={[styles.mgmtIcon, { backgroundColor: "#0EA5E9" }]}>
              <PlusCircle color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.mgmtName}>Productos</Text>
            <Text style={styles.mgmtAction}>Gestionar catálogo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mgmtCard, { backgroundColor: "#F5F3FF" }]}
            onPress={onNavigateToOffers}
          >
            <View style={[styles.mgmtIcon, { backgroundColor: "#7C3AED" }]}>
              <Tag color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.mgmtName}>Ofertas</Text>
            <Text style={styles.mgmtAction}>Ver promociones</Text>
          </TouchableOpacity>
        </View>

        {/* Live Orders List */}
        <View style={styles.ordersHeader}>
          <Text style={styles.sectionTitle}>PEDIDOS EN VIVO</Text>
          <TouchableOpacity onPress={onViewAllOrders}>
            <Text style={styles.seeAllText}>Historial completo</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => onSelectOrder(order)}
            activeOpacity={0.8}
          >
            <View style={styles.orderCardLeft}>
              <View style={styles.orderAvatar}>
                <Text style={styles.avatarText}>
                  {order.customerName.charAt(0)}
                </Text>
              </View>
              <View style={styles.orderMainInfo}>
                <Text style={styles.orderIdText}>#{order.id.slice(0, 8)}</Text>
                <Text style={styles.orderCustomerName} numberOfLines={1}>
                  {order.customerName}
                </Text>
              </View>
            </View>
            <View style={styles.orderCardRight}>
              <Text style={styles.orderPriceText}>{order.total}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      order.status === "Pendiente" ? "#FEF3C7" : "#DCFCE7",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        order.status === "Pendiente" ? "#D97706" : "#059669",
                    },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {recentOrders.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <ShoppingBag size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>Sin pedidos pendientes</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  adminName: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 28,
    color: "#FFFFFF",
    marginTop: 4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  activeDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: "#1E293B",
  },
  mainStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  mainStat: {
    flex: 1,
  },
  mainStatLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 1,
    marginBottom: 4,
  },
  mainStatValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -20,
    paddingBottom: 40,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
    }),
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#10B981",
  },
  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 5,
  },
  barWrapper: {
    alignItems: "center",
  },
  bar: {
    width: 14,
    borderRadius: 8,
  },
  barLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  statItemValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#1E293B",
  },
  statItemLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#64748B",
  },
  sectionTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  managementRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  mgmtCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
  },
  mgmtIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mgmtName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  mgmtAction: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: colors.primary,
    marginTop: -16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  orderCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  orderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#64748B",
  },
  orderMainInfo: {
    flex: 1,
  },
  orderIdText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#94A3B8",
  },
  orderCustomerName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
    marginTop: 2,
  },
  orderCardRight: {
    alignItems: "flex-end",
  },
  orderPriceText: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 17,
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  statusBadgeText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 12,
  },
});
