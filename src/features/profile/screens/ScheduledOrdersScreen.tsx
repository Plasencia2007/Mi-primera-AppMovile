import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Bell,
  ArrowRight,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "../../../theme";

const { width } = Dimensions.get("window");

interface ScheduledOrdersScreenProps {
  onBack: () => void;
}

export const ScheduledOrdersScreen = ({
  onBack,
}: ScheduledOrdersScreenProps) => {
  // Mock data for scheduled orders
  const scheduledOrders = [
    {
      id: "RES-8821",
      date: "Mañana, 05 Feb",
      time: "07:30 PM",
      total: "S/ 45.90",
      itemsCount: 3,
      store: "Luxe Grill - Miraflores",
      itemsPreview: "Dúo Classic, Papas XL, Inka Kola 500ml",
    },
    {
      id: "RES-9932",
      date: "Sáb, 08 Feb",
      time: "01:00 PM",
      total: "S/ 120.00",
      itemsCount: 5,
      store: "Luxe Grill - San Isidro",
      itemsPreview: "Parrilla para 4, Bebidas variadas...",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#1e293b" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reserva de Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Card */}
        <LinearGradient
          colors={["#1E293B", "#0F172A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCard}
        >
          <View style={styles.infoIconBox}>
            <Calendar size={24} color={colors.white} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Planifica con tiempo</Text>
            <Text style={styles.infoSubtitle}>
              Tus pedidos programados aparecerán aquí. Te avisaremos 30 min
              antes.
            </Text>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>PEDIDOS PROGRAMADOS</Text>

        {scheduledOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={64} color="#CBD5E1" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Sin reservas</Text>
            <Text style={styles.emptySubtitle}>
              Aún no has programado ningún pedido para el futuro.
            </Text>
          </View>
        ) : (
          scheduledOrders.map((res) => (
            <View key={res.id} style={styles.reservaCard}>
              <View style={styles.cardHeader}>
                <View style={styles.dateTimeBadge}>
                  <Clock size={14} color={colors.primary} />
                  <Text style={styles.dateTimeText}>
                    {res.date} • {res.time}
                  </Text>
                </View>
                <Text style={styles.resId}>{res.id}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.storeName}>{res.store}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#94a3b8" />
                  <Text style={styles.locationText}>
                    Dirección predeterminada
                  </Text>
                </View>

                <View style={styles.itemsBox}>
                  <Text style={styles.itemsTitle}>Resumen</Text>
                  <Text style={styles.itemsText} numberOfLines={1}>
                    {res.itemsPreview}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.totalLabel}>TOTAL ESTIMADO</Text>
                  <Text style={styles.totalValue}>{res.total}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.reminderBtn}>
                    <Bell size={18} color="#64748b" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn}>
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={styles.cancelLink}>Anular</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.newReserveBtn} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, "#b80202"]}
            style={styles.newReserveGradient}
          >
            <Calendar size={20} color={colors.white} />
            <Text style={styles.newReserveText}>Programar Nuevo Pedido</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  infoCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  infoSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  reservaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dateTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  dateTimeText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 12,
    color: colors.primary,
  },
  resId: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#94a3b8",
  },
  cardBody: {
    padding: 20,
  },
  storeName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: "#1e293b",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#64748b",
  },
  itemsBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
  },
  itemsTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  itemsText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#475569",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  totalLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: "#0f172a",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  reminderBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    gap: 8,
  },
  cancelLink: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: "#EF4444",
  },
  newReserveBtn: {
    marginTop: 10,
  },
  newReserveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 20,
    gap: 12,
  },
  newReserveText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#1e293b",
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },
});
