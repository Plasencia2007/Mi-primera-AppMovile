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
  StatusBar,
  TextInput,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  User,
  Calendar,
  ExternalLink,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "../../../theme";
import { useAdmin, AdminOrder } from "../store/useAdmin";
import { OrderStatus } from "../../../types/order.types";
import { useNotification } from "../../../store/useNotification";

interface AdminOrdersScreenProps {
  onBack: () => void;
}

export const AdminOrdersScreen = ({ onBack }: AdminOrdersScreenProps) => {
  const insets = useSafeAreaInsets();
  const {
    orders,
    fetchAdminOrders,
    updateOrderStatus,
    subscribeToOrders,
    isLoading,
  } = useAdmin();
  const showNotification = useNotification((state) => state.showNotification);
  const [filter, setFilter] = useState<OrderStatus | "Todos" | "Activos">(
    "Activos",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<{
    id: string;
    currentStatus: OrderStatus;
  } | null>(null);

  const STATUS_FLOW: OrderStatus[] = [
    "Pendiente",
    "Preparando",
    "En camino",
    "Entregado",
    "Cancelado",
  ];

  useEffect(() => {
    fetchAdminOrders();
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, []);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = orders.filter((o) => {
    let matchesFilter = false;
    if (filter === "Todos") {
      matchesFilter = true;
    } else if (filter === "Activos") {
      matchesFilter = o.status !== "Entregado" && o.status !== "Cancelado";
    } else {
      matchesFilter = o.status === filter;
    }
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (orderId: string, currentStatus: OrderStatus) => {
    setOrderToUpdate({ id: orderId, currentStatus });
    setStatusModalVisible(true);
  };

  const confirmStatusUpdate = async (newStatus: OrderStatus) => {
    if (!orderToUpdate) return;

    try {
      await updateOrderStatus(orderToUpdate.id, newStatus);
      setStatusModalVisible(false);
      setOrderToUpdate(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado");
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pendiente":
        return "#F59E0B";
      case "Preparando":
        return "#6366F1";
      case "En camino":
        return "#0EA5E9";
      case "Entregado":
        return "#10B981";
      case "Cancelado":
        return "#EF4444";
      default:
        return "#94A3B8";
    }
  };

  const StatusIcon = ({ status }: { status: OrderStatus }) => {
    const color = getStatusColor(status);
    switch (status) {
      case "Pendiente":
        return <Clock size={14} color={color} />;
      case "Preparando":
        return <Package size={14} color={color} />;
      case "En camino":
        return <Truck size={14} color={color} />;
      case "Entregado":
        return <CheckCircle2 size={14} color={color} />;
      case "Cancelado":
        return <XCircle size={14} color={color} />;
      default:
        return null;
    }
  };

  const getStatusGradient = (status: OrderStatus): [string, string] => {
    switch (status) {
      case "Pendiente":
        return ["#F59E0B", "#D97706"];
      case "Preparando":
        return ["#6366F1", "#4F46E5"];
      case "En camino":
        return ["#0EA5E9", "#0284C7"];
      case "Entregado":
        return ["#10B981", "#059669"];
      case "Cancelado":
        return ["#EF4444", "#DC2626"];
      default:
        return ["#94A3B8", "#64748B"];
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      {/* Header */}
      <View style={styles.compactHeader}>
        <View style={styles.compactHeaderTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtnMini}>
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.compactTitle}>Gestión de Pedidos</Text>
          <View style={styles.badgeMini}>
            <Text style={styles.badgeTextMini}>{filteredOrders.length}</Text>
          </View>
        </View>

        <View style={styles.compactSearchSection}>
          <View style={styles.compactSearchBar}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={styles.compactSearchInput}
              placeholder="Buscar por ID, cliente..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      {/* Modern Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsScroll}
        >
          {[
            "Activos",
            "Todos",
            "Pendiente",
            "Preparando",
            "En camino",
            "Entregado",
            "Cancelado",
          ].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item as any)}
              style={[
                styles.filterTab,
                filter === item && styles.activeFilterTab,
                filter === item && {
                  backgroundColor:
                    getStatusColor(item as any) || colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === item && styles.activeFilterTabText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            Cargando pedidos en tiempo real...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentPadding}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <View key={order.id} style={styles.modernOrderCard}>
                {/* Card Header: Order Meta */}
                <View
                  style={[
                    styles.modernCardHeader,
                    { marginBottom: isExpanded ? 20 : 12 },
                  ]}
                >
                  <View style={styles.orderMetadata}>
                    <View style={styles.idContainer}>
                      <Text style={styles.idPrefix}>PEDIDO</Text>
                      <Text style={styles.idMain}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.timestampRow}>
                      <Clock size={12} color="#94A3B8" />
                      <Text style={styles.timestampText}>
                        {new Date(order.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(order.id, order.status)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={getStatusGradient(order.status)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statusPill}
                    >
                      <StatusIcon status={order.status} />
                      <Text style={styles.statusPillText}>{order.status}</Text>
                      <ChevronDown size={14} color="#FFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Customer Section: Mini Profile */}
                <View style={styles.customerProfileCard}>
                  <View
                    style={[
                      styles.customerAvatarMiniature,
                      { backgroundColor: getStatusColor(order.status) + "10" },
                    ]}
                  >
                    <User size={18} color={getStatusColor(order.status)} />
                  </View>
                  <View style={styles.customerBaseInfo}>
                    <Text style={styles.customerBaseName}>
                      {order.customerName}
                    </Text>
                    <View style={styles.customerBaseDetail}>
                      <MapPin size={12} color="#94A3B8" />
                      <Text
                        style={styles.customerBaseAddress}
                        numberOfLines={1}
                      >
                        {order.address}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.quickActions}>
                    {order.customerPhone && (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(`tel:${order.customerPhone}`)
                          }
                          style={styles.actionCircle}
                        >
                          <Phone size={14} color="#1E293B" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://wa.me/51${order.customerPhone}`,
                            )
                          }
                          style={[
                            styles.actionCircle,
                            { backgroundColor: "#DCFCE7" },
                          ]}
                        >
                          <MessageSquare size={14} color="#166534" />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                {isExpanded && (
                  <>
                    <View style={styles.innerDivider} />
                    {/* Items Section: Visual List */}
                    <View style={styles.visualItemsList}>
                      {order.items.map((item, idx) => (
                        <View key={idx} style={styles.visualItemRow}>
                          <View style={styles.productThumbContainer}>
                            {item.image ? (
                              <Image
                                source={{ uri: item.image }}
                                style={styles.productThumb}
                              />
                            ) : (
                              <View style={styles.productThumbPlaceholder}>
                                <Package size={20} color="#CBD5E1" />
                              </View>
                            )}
                            <View style={styles.qtyBadge}>
                              <Text style={styles.qtyBadgeText}>
                                {item.quantity}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.productPrice}>
                              {item.price}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {/* Card Footer: Summary */}
                <View style={styles.modernCardFooter}>
                  <View style={styles.footerLeft}>
                    <View style={styles.paymentMethodContainer}>
                      <Text style={styles.paymentMethodValueText}>
                        {order.paymentMethod.toUpperCase()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleOrderExpansion(order.id)}
                      style={styles.expandButton}
                    >
                      <Text style={styles.expandButtonText}>
                        {isExpanded ? "Ver menos" : "Ver detalles"}
                      </Text>
                      <ChevronDown
                        size={16}
                        color="#64748B"
                        style={{
                          transform: [
                            { rotate: isExpanded ? "180deg" : "0deg" },
                          ],
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.finalTotalContainer}>
                    <Text style={styles.totalLabelSmall}>POR PAGAR</Text>
                    <Text style={styles.totalValueLarge}>{order.total}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {filteredOrders.length === 0 && (
            <View style={styles.emptyView}>
              <View style={styles.emptyIconCircle}>
                <Package size={40} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitleLarge}>No hay pedidos aquí</Text>
              <Text style={styles.emptySubtitleLarge}>
                Prueba cambiando el filtro o la búsqueda
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      {/* Status Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setStatusModalVisible(false)}
          />
          <View style={styles.statusModalContent}>
            <View style={styles.modalHeaderLine} />

            <View style={styles.statusModalHeader}>
              <Text style={styles.statusModalTitle}>Actualizar Estado</Text>
              <Text style={styles.statusModalSubtitle}>
                Pedido #{orderToUpdate?.id.slice(0, 8).toUpperCase()}
              </Text>
            </View>

            <View style={styles.statusOptionsGrid}>
              {STATUS_FLOW.map((status) => {
                const isActive = orderToUpdate?.currentStatus === status;
                const color = getStatusColor(status);

                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOptionItem,
                      isActive && {
                        borderColor: color,
                        backgroundColor: color + "08",
                      },
                    ]}
                    onPress={() => confirmStatusUpdate(status)}
                  >
                    <View
                      style={[
                        styles.statusIconCircle,
                        { backgroundColor: color + "15" },
                      ]}
                    >
                      <StatusIcon status={status} />
                    </View>
                    <View style={styles.statusOptionTextContainer}>
                      <Text
                        style={[
                          styles.statusOptionLabel,
                          isActive && { color },
                        ]}
                      >
                        {status}
                      </Text>
                      {isActive && (
                        <View
                          style={[
                            styles.activeStatusIndicator,
                            { backgroundColor: color },
                          ]}
                        >
                          <Text style={styles.activeStatusText}>ACTUAL</Text>
                        </View>
                      )}
                    </View>
                    {!isActive && (
                      <ArrowLeft
                        size={16}
                        color="#CBD5E1"
                        style={{ transform: [{ rotate: "180deg" }] }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.statusModalCloseBtn}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.statusModalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9", // Brighter, more modern light gray
  },
  compactHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20, // Increased to give space for the curve
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 15,
      },
      android: { elevation: 6 },
    }),
  },
  compactHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    marginBottom: 4,
  },
  backBtnMini: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  compactTitle: {
    flex: 1,
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#0F172A",
    marginLeft: 4,
  },
  badgeMini: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  compactUnderline: {
    width: 40,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: -2,
  },
  compactSearchSection: {
    marginTop: 12, // Space from Title row
  },
  compactSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  compactSearchInput: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#1E293B",
    marginLeft: 8,
    padding: 0,
  },
  filterSection: {
    marginTop: 8, // Breathing room from the header curve
    zIndex: 10,
  },
  filterTabsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
  activeFilterTab: {
    borderColor: "transparent",
  },
  filterTabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#64748B",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  contentScroll: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
    paddingTop: 10,
  },
  modernOrderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F8FAFC",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.08,
        shadowRadius: 25,
      },
      android: { elevation: 4 },
    }),
  },
  modernCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  idPrefix: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 1,
  },
  idMain: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: "#0F172A",
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  timestampText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#64748B",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
  },
  statusPillText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  customerProfileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  customerAvatarMiniature: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  customerBaseInfo: {
    flex: 1,
    marginLeft: 14,
  },
  customerBaseName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#0F172A",
  },
  customerBaseDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  customerBaseAddress: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#64748B",
    flex: 1,
  },
  quickActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  innerDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 20,
    marginHorizontal: 4,
  },
  visualItemsList: {
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  visualItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productThumbContainer: {
    position: "relative",
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
  },
  productThumbPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#0F172A",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 10,
  },
  qtyBadgeText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: "#FFFFFF",
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 15,
    color: "#1E293B",
  },
  productPrice: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  modernCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 4,
  },
  footerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  expandButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#64748B",
  },
  paymentMethodContainer: {
    gap: 2,
  },
  paymentMethodLabelText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  paymentMethodValueText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 12,
    color: "#94A3B8",
  },
  finalTotalContainer: {
    alignItems: "flex-end",
    gap: 0,
  },
  totalLabelSmall: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 9,
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  totalValueLarge: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 24,
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#64748B",
  },
  emptyView: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitleLarge: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#0F172A",
  },
  emptySubtitleLarge: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },
  statusModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  statusModalHeader: {
    marginBottom: 24,
  },
  statusModalTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 22,
    color: "#0F172A",
    marginBottom: 4,
  },
  statusModalSubtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#64748B",
  },
  statusOptionsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  statusOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusOptionTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusOptionLabel: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  activeStatusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeStatusText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 9,
    color: "#FFFFFF",
  },
  statusModalCloseBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  statusModalCloseText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#475569",
  },
});
