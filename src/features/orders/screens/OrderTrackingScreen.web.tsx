import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import {
  ChevronLeft,
  Truck,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  Map as MapIcon,
} from "lucide-react-native";
import { colors, spacing } from "../../../theme";
import { IconButton } from "../../../components/ui/IconButton";
import { Order } from "../../../types/order.types";

const { width, height } = Dimensions.get("window");

interface OrderTrackingScreenProps {
  order: Order;
  onBack: () => void;
}

// Web version doesn't use react-native-maps to avoid bundling errors
export const OrderTrackingScreen = ({
  order,
  onBack,
}: OrderTrackingScreenProps) => {
  const statusSteps = [
    {
      id: "Pendiente",
      label: "Pedido recibido",
      time: "12:30 PM",
      completed: true,
    },
    {
      id: "Preparando",
      label: "En la cocina",
      time: "12:35 PM",
      completed: true,
    },
    {
      id: "En camino",
      label: "El repartidor va en camino",
      time: "12:45 PM",
      completed: order.status === "En camino" || order.status === "Entregado",
    },
    {
      id: "Entregado",
      label: "¡Pedido entregado!",
      time: "--:--",
      completed: order.status === "Entregado",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Visual Placeholder for Map on Web */}
      <View style={styles.mapContainer}>
        <View style={styles.webMapPlaceholder}>
          <MapIcon size={48} color={colors.primary + "40"} />
          <Text style={styles.webMapText}>
            El mapa interactivo está disponible en la App móvil
          </Text>

          {/* Mock delivery path visualization for web */}
          <View style={styles.webPathRow}>
            <View style={styles.webPathDot} />
            <View style={styles.webPathLine} />
            <Truck size={24} color={colors.primary} />
            <View
              style={[styles.webPathLine, { backgroundColor: "#E2E8F0" }]}
            />
            <MapPin size={24} color={colors.success} />
          </View>
        </View>

        <View style={styles.headerOverlay}>
          <IconButton
            icon={<ChevronLeft size={24} color={colors.text} />}
            onPress={onBack}
            style={styles.backButton}
          />
          <View style={styles.orderBadge}>
            <Text style={styles.orderBadgeText}>{order.id}</Text>
          </View>
        </View>
      </View>

      {/* Tracking Info Bottom Sheet */}
      <View style={styles.infoContainer}>
        <View style={styles.handleBar} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollInsideInfo}
        >
          {/* Status Main Info */}
          <View style={styles.mainStatusRow}>
            <View>
              <Text style={styles.statusTitle}>
                Llegará en{" "}
                <Text style={{ color: colors.primary }}>15-20 min</Text>
              </Text>
              <Text style={styles.statusSubtitle}>
                El repartidor está cerca de tu ubicación
              </Text>
            </View>
            <View style={styles.deliveryTimeBadge}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.deliveryTimeText}>13:05</Text>
            </View>
          </View>

          {/* Driver Card */}
          <View style={styles.driverCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop",
              }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Carlos Rodríguez</Text>
              <View style={styles.driverRating}>
                <Truck size={12} color="#F59E0B" />
                <Text style={styles.driverRatingText}>
                  Repartidor Pro • 4.9
                </Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <MessageCircle size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              >
                <Phone size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timeline}>
            {statusSteps.map((step, index) => (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      step.completed ? styles.dotCompleted : styles.dotPending,
                    ]}
                  >
                    {step.completed && (
                      <CheckCircle2 size={14} color={colors.white} />
                    )}
                  </View>
                  {index !== statusSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.completed && statusSteps[index + 1].completed
                          ? styles.lineCompleted
                          : styles.linePending,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      step.completed
                        ? styles.textCompleted
                        : styles.textPending,
                    ]}
                  >
                    {step.label}
                  </Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mapContainer: {
    height: height * 0.45,
    width: "100%",
    backgroundColor: "#F1F5F9",
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webMapText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  webPathRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    justifyContent: "center",
  },
  webPathDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  webPathLine: {
    height: 3,
    flex: 1,
    backgroundColor: colors.primary,
    marginHorizontal: 5,
  },
  headerOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  orderBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  orderBadgeText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: colors.primary,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: -30,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: { elevation: 10 },
    }),
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  scrollInsideInfo: {
    paddingBottom: 40,
  },
  mainStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  statusTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 22,
    color: "#1E293B",
    marginBottom: 4,
  },
  statusSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
  },
  deliveryTimeBadge: {
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
    gap: 4,
  },
  deliveryTimeText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: colors.primary,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  driverRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  driverRatingText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#64748B",
  },
  driverActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeline: {
    paddingLeft: 5,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 60,
  },
  timelineLeft: {
    width: 30,
    alignItems: "center",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
  dotPending: {
    backgroundColor: "#E2E8F0",
    borderWidth: 2,
    borderColor: "#CBD5E1",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -2,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
  linePending: {
    backgroundColor: "#E2E8F0",
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 15,
    paddingTop: 2,
  },
  timelineLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  timelineTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#94A3B8",
  },
  textCompleted: {
    color: "#1E293B",
  },
  textPending: {
    color: "#94A3B8",
  },
});
