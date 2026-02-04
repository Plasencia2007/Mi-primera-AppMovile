import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react-native";
import { colors, spacing } from "../../../theme";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { useCart } from "../store/useCart";
import { useOrders } from "../../orders/store/useOrders";
import { useAddresses } from "../../profile/store/useAddresses";
import { usePayments } from "../../payments/store/usePayments";
import { useNotification } from "../../../store/useNotification";

interface CheckoutScreenProps {
  onBack: () => void;
  onOrderSuccess: (orderId: string) => void;
  onNavigateToAddresses: () => void;
  onNavigateToPayments: () => void;
}

export const CheckoutScreen = ({
  onBack,
  onOrderSuccess,
  onNavigateToAddresses,
  onNavigateToPayments,
}: CheckoutScreenProps) => {
  const [showAddressDetail, setShowAddressDetail] = useState(false);
  const { items, getTotal, clearCart } = useCart();
  const { placeOrder, isLoading: isOrderLoading } = useOrders();
  const { addresses, selectedAddressId } = useAddresses();
  const { methods, selectedMethodId } = usePayments();
  const showNotification = useNotification((state) => state.showNotification);

  const total = getTotal();
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const selectedPayment = methods.find((m) => m.id === selectedMethodId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showNotification({
        type: "warning",
        title: "Dirección requerida",
        message: "Por favor, selecciona una dirección para el envío.",
      });
      return;
    }

    if (!selectedMethodId) {
      showNotification({
        type: "warning",
        title: "Pago requerido",
        message: "Por favor, selecciona un método de pago.",
      });
      return;
    }

    const result = await placeOrder(
      items,
      total,
      selectedAddressId,
      selectedMethodId,
    );

    if (result.success) {
      clearCart();
      onOrderSuccess(result.orderId!);
    } else {
      showNotification({
        type: "error",
        title: "Error",
        message: result.error || "No se pudo procesar el pedido.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={<ChevronLeft size={24} color={colors.text} />}
          onPress={onBack}
          variant="ghost"
        />
        <Text style={styles.headerTitle}>FINALIZAR PEDIDO</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Entregar en</Text>
            <TouchableOpacity onPress={onNavigateToAddresses}>
              <Text style={styles.editLink}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={() => setShowAddressDetail(!showAddressDetail)}
            activeOpacity={0.7}
          >
            <View style={styles.cardIconWrapper}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {selectedAddress?.title || "Seleccionar dirección"}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {selectedAddress?.street ||
                  "No has seleccionado una dirección aún"}
              </Text>
            </View>
            <ChevronRight
              size={20}
              color="#94A3B8"
              style={{
                transform: [{ rotate: showAddressDetail ? "90deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>

          {showAddressDetail && selectedAddress && (
            <View style={styles.addressDetailBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CALLE:</Text>
                <Text style={styles.detailValue}>{selectedAddress.street}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DISTRITO:</Text>
                <Text style={styles.detailValue}>
                  {selectedAddress.district}
                </Text>
              </View>
              {selectedAddress.interior && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>REFERENCIA:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAddress.interior}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Método de Pago</Text>
            <TouchableOpacity onPress={onNavigateToPayments}>
              <Text style={styles.editLink}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={onNavigateToPayments}
            activeOpacity={0.7}
          >
            <View
              style={[styles.cardIconWrapper, { backgroundColor: "#F1F5F9" }]}
            >
              <CreditCard size={24} color={colors.text} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {selectedPayment?.title || "Seleccionar pago"}
              </Text>
              <Text style={styles.cardSubtitle}>
                {selectedPayment?.subtitle || "Toca para elegir cómo pagar"}
              </Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Delivery Time Estimation */}
        <View style={styles.infoBox}>
          <Clock size={20} color="#F59E0B" />
          <Text style={styles.infoText}>
            Tiempo estimado de entrega:{" "}
            <Text style={{ fontWeight: "700" }}>30 - 45 min</Text>
          </Text>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>S/ {total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Costo de Envío</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                Gratis
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isOrderLoading ? "Procesando..." : "CONFIRMAR Y PAGAR"}
          onPress={handlePlaceOrder}
          loading={isOrderLoading}
          disabled={isOrderLoading}
          style={styles.placeOrderButton}
        />
        <View style={styles.secureBadge}>
          <CheckCircle2 size={14} color="#94A3B8" />
          <Text style={styles.secureText}>
            Pago 100% seguro con encriptación SSL
          </Text>
        </View>
      </View>
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
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 10 : 0,
    backgroundColor: "#F8FAFC",
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 18,
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#475569",
  },
  editLink: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.primary,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#94A3B8",
  },
  addressDetailBox: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: "#F1F5F9",
    marginTop: -10,
    paddingTop: 20,
    zIndex: -1,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#94A3B8",
    width: 80,
  },
  detailValue: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#475569",
    flex: 1,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  infoText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#92400E",
    marginLeft: 12,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
  },
  summaryValue: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 14,
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },
  totalLabel: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  totalValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: colors.primary,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  placeOrderButton: {
    height: 60,
    borderRadius: 30,
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  secureText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#94A3B8",
  },
});
