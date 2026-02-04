import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react-native";

import { colors, spacing } from "../../../theme";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { useCart, CartItem } from "../store/useCart";

interface CartScreenProps {
  onBack: () => void;
  onCheckout: () => void;
}

export const CartScreen = ({ onBack, onCheckout }: CartScreenProps) => {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <ShoppingBag size={80} color="#E9ECEF" />
        </View>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>
          ¡Añade algo delicioso para comenzar!
        </Text>
        <Button title="Ver Menú" onPress={onBack} style={styles.emptyButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={<ChevronLeft size={24} color={colors.text} />}
          onPress={onBack}
        />
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {items.map((item: CartItem) => (
          <View key={item.cartId} style={styles.cartItem}>
            <Image source={item.image} style={styles.itemImage} />

            <View style={styles.itemInfo}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.extras && item.extras.length > 0 && (
                  <Text style={styles.extrasText}>
                    {item.extras.map((e) => e.name).join(", ")}
                  </Text>
                )}
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>

              <View style={styles.quantityRow}>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.cartId, item.quantity - 1)
                    }
                    style={styles.qtyButton}
                  >
                    <Minus size={16} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.cartId, item.quantity + 1)
                    }
                    style={styles.qtyButton}
                  >
                    <Plus size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item.cartId)}
                  style={styles.removeButton}
                >
                  <Trash2 size={18} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
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

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
        </View>

        <Button
          title="Siguiente"
          onPress={onCheckout}
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: colors.white,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: colors.text,
  },
  cartList: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  itemName: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 16,
    color: colors.text,
  },
  extrasText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: colors.primary,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 2,
  },
  qtyButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 15,
    color: colors.text,
    paddingHorizontal: 10,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : spacing.lg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F3F5",
    marginBottom: 24,
  },
  totalLabel: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: colors.text,
  },
  totalValue: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: colors.primary,
  },
  checkoutButton: {
    width: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F3F5",
    marginVertical: 12,
  },
  selectionSummary: {
    marginBottom: 20,
    gap: 12,
  },
  selectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectionLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  selectionValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.text,
    flex: 0.8,
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  emptyIconWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  emptyButton: {
    width: "100%",
  },
});
