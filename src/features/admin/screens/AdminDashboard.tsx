import React, { useEffect, useState, useRef } from "react";
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
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  Store,
  Bell,
  Search,
  MoreVertical,
  LogOut,
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
  onNavigateToCustomers: () => void;
  onExit: () => void;
}

export const AdminDashboard = ({
  onSelectOrder,
  onViewAllOrders,
  onNavigateToProducts,
  onNavigateToOffers,
  onNavigateToCustomers,
  onExit,
}: AdminDashboardProps) => {
  const insets = useSafeAreaInsets();
  const { orders, stats, isLoading, fetchAdminOrders, subscribeToOrders } =
    useAdmin();
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchAdminOrders();
    const unsubscribe = subscribeToOrders();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => unsubscribe();
  }, []);

  const recentOrders = orders.slice(0, 5);

  const formatSales = (val: number) => {
    return val.toLocaleString("es-PE", { minimumFractionDigits: 2 });
  };

  const SalesChart = () => {
    const days = ["D", "L", "M", "M", "J", "V", "S"];
    const last7DaysLabels = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return days[d.getDay()];
      })
      .reverse();

    const maxSales = Math.max(...stats.weeklySales, 1);

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Rendimiento Semanal</Text>
            <Text style={styles.chartSubtitle}>
              Ingresos reales de los últimos 7 días
            </Text>
          </View>
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: stats.salesTrend >= 0 ? "#ECFDF5" : "#FEF2F2",
              },
            ]}
          >
            <ArrowUpRight
              size={14}
              color={stats.salesTrend >= 0 ? "#10B981" : "#EF4444"}
              style={{
                transform: [
                  { rotate: stats.salesTrend >= 0 ? "0deg" : "90deg" },
                ],
              }}
            />
            <Text
              style={[
                styles.trendText,
                { color: stats.salesTrend >= 0 ? "#10B981" : "#EF4444" },
              ]}
            >
              {stats.salesTrend >= 0 ? "+" : ""}
              {stats.salesTrend.toFixed(1)}%
            </Text>
          </View>
        </View>
        <View style={styles.barChart}>
          {stats.weeklySales.map((value, i) => (
            <View key={i} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                <LinearGradient
                  colors={
                    i === 6
                      ? [colors.primary, "#910000"]
                      : ["#E2E8F0", "#CBD5E1"]
                  }
                  style={[styles.bar, { height: (value / maxSales) * 80 + 5 }]}
                />
              </View>
              <Text style={styles.barLabel}>{last7DaysLabels[i]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const WorkloadStats = () => {
    const total = orders.length || 1;
    const pending = orders.filter((o) => o.status === "Pendiente").length;
    const preparing = orders.filter((o) => o.status === "Preparando").length;
    const shipping = orders.filter((o) => o.status === "En camino").length;

    return (
      <View style={styles.workloadCard}>
        <View style={styles.workloadHeader}>
          <Text style={styles.workloadTitle}>Carga de Trabajo</Text>
          <Text style={styles.workloadCount}>{total} Pedidos</Text>
        </View>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressSegment,
              { flex: pending, backgroundColor: "#FEF3C7" },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              { flex: preparing, backgroundColor: "#DBEAFE" },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              { flex: shipping, backgroundColor: "#DCFCE7" },
            ]}
          />
        </View>

        <View style={styles.workloadLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
            <Text style={styles.legendText}>Clientes pidiendo</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#3B82F6" }]} />
            <Text style={styles.legendText}>En cocina</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
            <Text style={styles.legendText}>En entrega</Text>
          </View>
        </View>
      </View>
    );
  };

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
          <View style={styles.shopStatusContainer}>
            <Store color={isStoreOpen ? "#10B981" : "#EF4444"} size={20} />
            <Text
              style={[
                styles.shopStatusText,
                { color: isStoreOpen ? "#10B981" : "#EF4444" },
              ]}
            >
              TIENDA {isStoreOpen ? "ABIERTA" : "CERRADA"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconActionBtn}>
              <Search color="#FFFFFF" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconActionBtn}>
              <Bell color="#FFFFFF" size={20} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconActionBtn, styles.exitActionBtn]}
              onPress={onExit}
            >
              <LogOut color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Resumen Ejecutivo</Text>
          <Text style={styles.adminName}>Administrador</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mainStatsScroll}
          contentContainerStyle={styles.mainStatsContainer}
        >
          <View style={styles.mainStatCard}>
            <View style={styles.mainStatHeader}>
              <View
                style={[
                  styles.mainStatIcon,
                  { backgroundColor: "rgba(16, 185, 129, 0.2)" },
                ]}
              >
                <DollarSign size={18} color="#10B981" />
              </View>
              <Text style={styles.mainStatTitle}>INGRESOS</Text>
            </View>
            <Text style={styles.mainStatValue}>
              S/ {formatSales(stats.todaySales)}
            </Text>
            <Text style={styles.mainStatSubtitle}>Ventas de hoy</Text>
          </View>

          <View style={styles.mainStatCard}>
            <View style={styles.mainStatHeader}>
              <View
                style={[
                  styles.mainStatIcon,
                  { backgroundColor: "rgba(14, 165, 233, 0.2)" },
                ]}
              >
                <TrendingUp size={18} color="#0EA5E9" />
              </View>
              <Text style={styles.mainStatTitle}>TICKET PROM.</Text>
            </View>
            <Text style={styles.mainStatValue}>
              S/ {formatSales(stats.avgTicket)}
            </Text>
            <Text style={styles.mainStatSubtitle}>Promedio por pedido</Text>
          </View>

          <View style={styles.mainStatCard}>
            <View style={styles.mainStatHeader}>
              <View
                style={[
                  styles.mainStatIcon,
                  { backgroundColor: "rgba(245, 158, 11, 0.2)" },
                ]}
              >
                <ShoppingBag size={18} color="#F59E0B" />
              </View>
              <Text style={styles.mainStatTitle}>PEDIDOS</Text>
            </View>
            <Text style={styles.mainStatValue}>{orders.length}</Text>
            <Text style={styles.mainStatSubtitle}>En las últimas 24h</Text>
          </View>

          <TouchableOpacity
            style={[styles.mainStatCard, { marginRight: 0 }]}
            onPress={onNavigateToCustomers}
          >
            <View style={styles.mainStatHeader}>
              <View
                style={[
                  styles.mainStatIcon,
                  { backgroundColor: "rgba(139, 92, 246, 0.2)" },
                ]}
              >
                <Users size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.mainStatTitle}>CLIENTES</Text>
            </View>
            <Text style={styles.mainStatValue}>{stats.totalCustomers}</Text>
            <Text style={styles.mainStatSubtitle}>Usuarios registrados</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <View style={styles.content}>
        {/* Workload and Chart */}
        <WorkloadStats />
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
              <Text style={styles.statItemLabel}>Activos</Text>
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.topProductsSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>MÁS VENDIDOS</Text>
              <Text style={styles.sectionSubtitle}>
                Los favoritos de tus clientes
              </Text>
            </View>
            <TrendingUp size={20} color="#94A3B8" />
          </View>

          <View style={styles.topProductsList}>
            {stats.topProducts.map(
              (product: { name: string; quantity: number }, idx: number) => (
                <View key={idx} style={styles.topProductItem}>
                  <View
                    style={[
                      styles.rankBadge,
                      {
                        backgroundColor:
                          idx === 0
                            ? "#FFD700"
                            : idx === 1
                              ? "#C0C0C0"
                              : "#CD7F32",
                      },
                    ]}
                  >
                    <Text style={styles.rankText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.topProductName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View style={styles.topProductQtyBadge}>
                    <Text style={styles.topProductQtyText}>
                      {product.quantity} vendidos
                    </Text>
                  </View>
                </View>
              ),
            )}
            {stats.topProducts.length === 0 && (
              <Text style={styles.emptySmallText}>
                No hay datos de ventas aún
              </Text>
            )}
          </View>
        </View>

        {/* Management Section */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>GESTIÓN DE NEGOCIO</Text>
            <Text style={styles.sectionSubtitle}>
              Acciones rápidas para tu catálogo
            </Text>
          </View>
        </View>

        <View style={styles.managementRow}>
          <TouchableOpacity
            style={[styles.mgmtCard, { backgroundColor: "#F0F9FF" }]}
            onPress={onNavigateToProducts}
          >
            <View style={[styles.mgmtIcon, { backgroundColor: "#0EA5E9" }]}>
              <PlusCircle color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.mgmtName}>Productos</Text>
            <Text style={styles.mgmtAction}>Catálogo completo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mgmtCard, { backgroundColor: "#F5F3FF" }]}
            onPress={onNavigateToOffers}
          >
            <View style={[styles.mgmtIcon, { backgroundColor: "#7C3AED" }]}>
              <Tag color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.mgmtName}>Ofertas</Text>
            <Text style={styles.mgmtAction}>Promociones activas</Text>
          </TouchableOpacity>
        </View>

        {/* Live Orders List */}
        <View style={styles.ordersHeader}>
          <View style={styles.liveIndicatorRow}>
            <Text style={styles.sectionTitle}>PEDIDOS EN VIVO</Text>
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
          </View>
          <TouchableOpacity onPress={onViewAllOrders}>
            <Text style={styles.seeAllText}>Ver Historial</Text>
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
                <View style={styles.orderIdRow}>
                  <Text style={styles.orderIdText}>
                    #{order.id.slice(0, 8)}
                  </Text>
                  <Text style={styles.orderTimeText}>
                    {" "}
                    •{" "}
                    {new Date(order.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
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
                      order.status === "Pendiente"
                        ? "#FEF3C7"
                        : order.status === "Preparando"
                          ? "#DBEAFE"
                          : "#DCFCE7",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        order.status === "Pendiente"
                          ? "#D97706"
                          : order.status === "Preparando"
                            ? "#2563EB"
                            : "#059669",
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
            <ShoppingBag size={48} color="#CBD5E1" strokeWidth={1.5} />
            <Text style={styles.emptyText}>No hay pedidos para mostrar</Text>
            <Text style={styles.emptySubtext}>
              Los nuevos pedidos aparecerán aquí en tiempo real
            </Text>
          </View>
        )}
        {/* Mobile-Friendly Exit Button at the bottom */}
        <View style={styles.footerExitContainer}>
          <TouchableOpacity style={styles.largeExitBtn} onPress={onExit}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.largeExitBtnText}>
              Salir del Panel Administrador
            </Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>
            Versión Admin 2.4.0 • Modo Premium
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  shopStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  shopStatusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  exitActionBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderWidth: 1,
    marginLeft: 4, // Slight separation for the exit button
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: "#1E293B",
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  adminName: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 32,
    color: "#FFFFFF",
    marginTop: 2,
  },
  mainStatsScroll: {
    marginTop: 0,
    marginBottom: 0,
  },
  mainStatsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 10,
  },
  mainStatCard: {
    width: width * 0.45,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  mainStatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  mainStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainStatTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 1,
  },
  mainStatValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  mainStatSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -40,
    paddingBottom: 40,
  },
  workloadCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
    }),
  },
  workloadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  workloadTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#1E293B",
  },
  workloadCount: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.primary,
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressContainer: {
    height: 12,
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  progressSegment: {
    height: "100%",
  },
  workloadLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#64748B",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
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
    marginBottom: 24,
  },
  chartTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#1E293B",
  },
  chartSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  barContainer: {
    height: 80,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: 16,
    borderRadius: 8,
  },
  barLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    gap: 12,
  },
  statItemValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: "#1E293B",
  },
  statItemLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#64748B",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 12,
    color: colors.text,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  managementRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  mgmtCard: {
    flex: 1,
    padding: 20,
    borderRadius: 30,
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
  mgmtIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mgmtName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: "#1E293B",
  },
  mgmtAction: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  liveIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  seeAllText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.primary,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
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
    gap: 14,
    flex: 1,
  },
  orderAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#64748B",
  },
  orderMainInfo: {
    flex: 1,
  },
  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIdText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "#94A3B8",
  },
  orderTimeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#94A3B8",
  },
  orderCustomerName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: "#1E293B",
    marginTop: 2,
  },
  orderCardRight: {
    alignItems: "flex-end",
  },
  orderPriceText: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 18,
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 6,
  },
  statusBadgeText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    padding: 60,
  },
  emptyText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#64748B",
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
  },
  topProductsSection: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 30,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
    }),
  },
  topProductsList: {
    marginTop: 8,
  },
  topProductItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 14,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  topProductName: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#1E293B",
  },
  topProductQtyBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  topProductQtyText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#64748B",
  },
  emptySmallText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 20,
  },
  footerExitContainer: {
    marginTop: 40,
    marginBottom: 60,
    alignItems: "center",
  },
  largeExitBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  largeExitBtnText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#EF4444",
  },
  versionText: {
    marginTop: 16,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#94A3B8",
  },
});
