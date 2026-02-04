import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import {
  ChevronLeft,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  ArrowRight,
  RefreshCw,
  Search,
  Receipt,
  Map,
  Compass,
  AlertCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "../../../theme";
import { useOrders } from "../../orders/store/useOrders";
import { Order, OrderStatus, OrderItem } from "../../../types/order.types";
import { useNotification } from "../../../store/useNotification";
import { useCart } from "../../cart/store/useCart";

const { width } = Dimensions.get("window");

interface OrdersScreenProps {
  onBack: () => void;
  onTrackOrder: (order: Order) => void;
  onReorder: () => void;
  initialFilter?: "all" | OrderStatus;
}

export const OrdersScreen = ({
  onBack,
  onTrackOrder,
  onReorder,
  initialFilter = "all",
}: OrdersScreenProps) => {
  const { orders, fetchOrders, subscribeToOrders, isLoading, cancelOrder } =
    useOrders();
  const addItem = useCart((state) => state.addItem);
  const [selectedTab, setSelectedTab] = useState<"Activos" | "Historial">(
    initialFilter === "En camino" || initialFilter === "all"
      ? "Activos"
      : "Historial",
  );
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string | null>(null);

  const CANCEL_REASONS = [
    "Pedido por error",
    "Tarda demasiado",
    "Cambio de planes",
    "Otro motivo",
  ];
  const showNotification = useNotification((state) => state.showNotification);

  React.useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "Activos") {
      return order.status === "Pendiente" || order.status === "En camino";
    }
    return order.status === "Entregado" || order.status === "Cancelado";
  });

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Entregado":
        return <CheckCircle2 size={16} color="#10B981" />;
      case "En camino":
        return <Truck size={16} color={colors.primary} />;
      case "Cancelado":
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#F59E0B" />;
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "Entregado":
        return { color: "#10B981", bg: "#DCFCE7", label: "Entregado" };
      case "En camino":
        return {
          color: colors.primary,
          bg: colors.primary + "15",
          label: "En camino",
        };
      case "Cancelado":
        return { color: "#EF4444", bg: "#FEE2E2", label: "Cancelado" };
      default:
        return { color: "#F59E0B", bg: "#FEF3C7", label: "Preparando" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const filters: Array<{ id: "all" | OrderStatus; label: string }> = [
    { id: "all", label: "Todos" },
    { id: "En camino", label: "Activos" },
    { id: "Entregado", label: "Historial" },
    { id: "Cancelado", label: "Cancelados" },
  ];

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const product = {
        id:
          item.productId ||
          `manual-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: item.name,
        price: item.price,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop",
      };
      addItem(product, item.quantity, []);
    });

    showNotification({
      type: "success",
      title: "Copia del pedido lista",
      message: "Se han añadido los productos al carrito.",
    });

    onReorder();
  };

  const handleCancel = (orderId: string) => {
    setOrderToCancel(orderId);
    setCancelReason(null);
    setCancelModalVisible(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;

    const result = await cancelOrder(orderToCancel);
    if (result.success) {
      showNotification({
        type: "success",
        title: "Pedido Cancelado",
        message: "Tu pedido ha sido cancelado correctamente.",
      });
    } else {
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo cancelar el pedido: " + result.error,
      });
    }
    setCancelModalVisible(false);
    setOrderToCancel(null);
  };

  return (
    <View style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Mis Pedidos</Text>
          <View style={styles.titleUnderline} />
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchOrders()}
        >
          <RefreshCw size={22} color="#181311" />
        </TouchableOpacity>
      </View>

      {/* SegmentedButtons */}
      <View style={styles.segmentedWrapper}>
        <View style={styles.segmentedBg}>
          <TouchableOpacity
            style={[
              styles.segmentedButton,
              selectedTab === "Activos" && styles.segmentedButtonActive,
            ]}
            onPress={() => setSelectedTab("Activos")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentedText,
                selectedTab === "Activos" && styles.segmentedTextActive,
              ]}
            >
              Activos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentedButton,
              selectedTab === "Historial" && styles.segmentedButtonActive,
            ]}
            onPress={() => setSelectedTab("Historial")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentedText,
                selectedTab === "Historial" && styles.segmentedTextActive,
              ]}
            >
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Package size={64} color="#CBD5E1" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Sin pedidos aún</Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === "Activos"
                ? "No tienes pedidos en curso ahora mismo. ¡Explora el menú!"
                : "Tu historial de pedidos aparecerá aquí."}
            </Text>
            <TouchableOpacity style={styles.browseBtn} onPress={onBack}>
              <Text style={styles.browseBtnText}>Ver el Menú</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                {selectedTab === "Activos"
                  ? "Pedidos en curso"
                  : "Pedidos recientes"}
              </Text>
              {selectedTab === "Activos" && (
                <View style={styles.activeCounter}>
                  <Text style={styles.activeCounterText}>
                    {filteredOrders.length} ACTIVO
                  </Text>
                </View>
              )}
            </View>

            {(filteredOrders as Order[]).map((order: Order) => {
              const status = getStatusStyles(order.status);

              if (selectedTab === "Activos") {
                return (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.activeOrderCard}
                    activeOpacity={0.9}
                    onPress={() => onTrackOrder(order)}
                  >
                    <View style={styles.activeCardImageContainer}>
                      <Image
                        source={{
                          uri:
                            typeof order.image === "string" &&
                            order.image.startsWith("http")
                              ? order.image
                              : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
                        }}
                        style={styles.activeCardImage}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.7)"]}
                        style={styles.activeCardOverlay}
                      />
                      <View style={styles.activeStatusRow}>
                        <View style={styles.activeBadgeContainer}>
                          <View style={styles.activeBadgeIcon}>
                            <Truck size={12} color="white" />
                          </View>
                          <Text style={styles.activeBadgeText}>
                            {status.label.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.activeCardBody}>
                      <View style={styles.activeCardMainRow}>
                        <View>
                          <Text style={styles.activeCardStoreName}>
                            Don Brassa - San Isidro
                          </Text>
                          <Text style={styles.activeCardOrderId}>
                            Pedido #{order.id.replace("ORD-", "")}
                          </Text>
                        </View>
                        <Text style={styles.activeCardPrice}>
                          {order.total}
                        </Text>
                      </View>

                      <Text style={styles.activeCardSummary} numberOfLines={2}>
                        {order.items.map((i) => i.name).join(", ")}
                      </Text>

                      <View style={styles.activeCardFooter}>
                        <View style={styles.activeTimeRow}>
                          <Clock size={16} color="#94A3B8" />
                          <Text style={styles.activeTimeText}>
                            {order.status === "Pendiente"
                              ? "Preparando..."
                              : "Llega en 15-20 min"}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                          {(order.status === "Pendiente" ||
                            order.status === "Preparando") && (
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={() => handleCancel(order.id)}
                            >
                              <XCircle size={16} color="#EF4444" />
                              <Text style={styles.cancelButtonText}>
                                Cancelar
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={styles.trackButton}
                            onPress={() => onTrackOrder(order)}
                          >
                            <Compass size={16} color="white" />
                            <Text style={styles.trackButtonText}>Rastrear</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }

              // Past Order Card Layout
              return (
                <View key={order.id} style={styles.pastOrderCard}>
                  <Image
                    source={{
                      uri:
                        typeof order.image === "string" &&
                        order.image.startsWith("http")
                          ? order.image
                          : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop",
                    }}
                    style={styles.pastCardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.pastCardContent}>
                    <View style={styles.pastCardHeader}>
                      <Text style={styles.pastCardStore}>Don Brassa</Text>
                      <Text style={styles.pastCardDate}>
                        {formatDate(order.date)}
                      </Text>
                    </View>
                    <Text style={styles.pastCardSummary} numberOfLines={1}>
                      {order.items.map((i) => i.name).join(", ")}
                    </Text>
                    <View style={styles.pastCardFooter}>
                      <Text style={styles.pastCardPrice}>{order.total}</Text>
                      <View style={styles.pastStatusLine}>
                        <CheckCircle2
                          size={14}
                          color={
                            order.status === "Cancelado" ? "#EF4444" : "#22C55E"
                          }
                        />
                        <Text
                          style={[
                            styles.pastStatusLabel,
                            {
                              color:
                                order.status === "Cancelado"
                                  ? "#EF4444"
                                  : "#22C55E",
                            },
                          ]}
                        >
                          {status.label.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      {/* Cancellation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={cancelModalVisible}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCancelModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.alertIconBg}>
                <AlertCircle size={32} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>¿Cancelar pedido?</Text>
              <Text style={styles.modalSubtitle}>
                Cuéntanos por qué deseas cancelar para seguir mejorando.
              </Text>
            </View>

            <View style={styles.reasonsContainer}>
              {CANCEL_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonItem,
                    cancelReason === reason && styles.reasonItemSelected,
                  ]}
                  onPress={() => setCancelReason(reason)}
                >
                  <View
                    style={[
                      styles.reasonRadio,
                      cancelReason === reason && styles.reasonRadioSelected,
                    ]}
                  >
                    {cancelReason === reason && (
                      <View style={styles.reasonRadioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.reasonText,
                      cancelReason === reason && styles.reasonTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.keepBtn}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.keepBtnText}>No, volver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmCancelBtn,
                  !cancelReason && styles.confirmCancelBtnDisabled,
                ]}
                disabled={!cancelReason}
                onPress={confirmCancel}
              >
                <Text style={styles.confirmCancelBtnText}>Sí, cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 10,
    paddingBottom: 5,
    backgroundColor: "#F8F6F6",
  },
  titleContainer: {
    flex: 1,
    position: "relative",
  },
  headerTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 32,
    color: "#181311",
    textAlign: "left",
    letterSpacing: -0.5,
  },
  titleUnderline: {
    width: 40,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: -2,
    marginLeft: 2,
  },
  refreshButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  segmentedWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  segmentedBg: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 4,
  },
  segmentedButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  segmentedButtonActive: {
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentedText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#64748B",
  },
  segmentedTextActive: {
    color: colors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 18,
    color: "#181311",
  },
  activeCounter: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  activeCounterText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
  activeOrderCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeCardImageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  activeCardImage: {
    width: "100%",
    height: "100%",
  },
  activeCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  activeStatusRow: {
    position: "absolute",
    bottom: 12,
    left: 16,
  },
  activeBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeBadgeIcon: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 11,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  activeCardBody: {
    padding: 20,
  },
  activeCardMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  activeCardStoreName: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: colors.primary,
    marginBottom: 2,
  },
  activeCardOrderId: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 22,
    color: "#181311",
  },
  activeCardPrice: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#181311",
  },
  activeCardSummary: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 20,
  },
  activeCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  activeTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeTimeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#64748B",
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
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
  trackButtonText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  cancelButtonText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: "#EF4444",
  },
  pastOrderCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pastCardImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  pastCardContent: {
    flex: 1,
  },
  pastCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  pastCardStore: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#181311",
  },
  pastCardDate: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#94A3B8",
  },
  pastCardSummary: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },
  pastCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pastCardPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary,
  },
  pastStatusLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pastStatusLabel: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#181311",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  browseBtnText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
      },
      android: { elevation: 12 },
    }),
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  alertIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 24,
    color: "#0F172A",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  reasonsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 12,
  },
  reasonItemSelected: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
  },
  reasonRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  reasonRadioSelected: {
    borderColor: "#EF4444",
  },
  reasonRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  reasonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#475569",
  },
  reasonTextSelected: {
    color: "#991B1B",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
  },
  keepBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  keepBtnText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#475569",
  },
  confirmCancelBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmCancelBtnDisabled: {
    backgroundColor: "#FECACA",
    opacity: 0.7,
  },
  confirmCancelBtnText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
