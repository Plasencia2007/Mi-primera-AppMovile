import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Apple,
  Wallet,
} from "lucide-react-native";
import { colors } from "../../../theme";
import { IconButton } from "../../../components/ui/IconButton";
import { usePayments } from "../store/usePayments";
import { PaymentMethod } from "../../../types/payment.types";
import { DeleteConfirmationModal } from "../../../components/modals/DeleteConfirmationModal";

interface PaymentMethodsScreenProps {
  onBack: () => void;
  onAddPayment: () => void;
  onEditPayment: (method: PaymentMethod) => void;
  onSelectMethod?: (id: string) => void;
}

export const PaymentMethodsScreen = ({
  onBack,
  onAddPayment,
  onEditPayment,
  onSelectMethod,
}: PaymentMethodsScreenProps) => {
  const {
    methods,
    otherMethods,
    selectedMethodId,
    setSelectedMethod,
    removeMethod,
    setPrimaryMethod,
  } = usePayments();
  const [methodToDelete, setMethodToDelete] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const getIconForType = (type: string, details?: any) => {
    switch (type) {
      case "VISA":
        return <Text style={styles.visaIconText}>VISA</Text>;
      case "MASTERCARD":
        return (
          <View style={styles.mastercardIcon}>
            <View style={[styles.mcCircle, { backgroundColor: "#EF4444" }]} />
            <View
              style={[
                styles.mcCircle,
                { backgroundColor: "#F59E0B", marginLeft: -8 },
              ]}
            />
          </View>
        );
      case "YAPE":
        return <Text style={styles.yapeIconText}>Yape</Text>;
      case "PLIN":
        return <Text style={styles.plinIconText}>PLIN</Text>;
      case "APPLE_PAY":
        return <Apple size={20} color="#FFF" />;
      case "GOOGLE_PAY":
        return (
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
        );
      case "PAYPAL":
        return <CreditCard size={20} color="#2563EB" />;
      case "CASH":
        return <Wallet size={20} color="#059669" />;
      default:
        return <CreditCard size={20} color="#94A3B8" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "YAPE":
        return "#7C3AED";
      case "PLIN":
        return "#22D3EE";
      case "APPLE_PAY":
        return "#000";
      case "GOOGLE_PAY":
        return "#FFFFFF";
      case "CASH":
        return "#D1FAE5";
      default:
        return "#F1F5F9";
    }
  };

  const handleDelete = (id: string, title: string) => {
    setMethodToDelete({ id, title });
  };

  const confirmDelete = () => {
    if (methodToDelete) {
      removeMethod(methodToDelete.id);
      setMethodToDelete(null);
    }
  };

  const PaymentMethodItem = ({ method }: { method: PaymentMethod }) => (
    <TouchableOpacity
      style={styles.methodCard}
      activeOpacity={0.7}
      onPress={() => {
        setPrimaryMethod(method.id);
        if (onSelectMethod) {
          onSelectMethod(method.id);
        }
      }}
    >
      <View
        style={[
          styles.methodIconWrapper,
          { backgroundColor: getIconBg(method.type) },
        ]}
      >
        {getIconForType(method.type)}
      </View>
      <View style={styles.methodInfo}>
        <View style={styles.methodTitleRow}>
          <Text style={styles.methodTitle}>{method.title}</Text>
          {method.isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryText}>PRINCIPAL</Text>
            </View>
          )}
        </View>
        {method.subtitle && (
          <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
        )}
      </View>
      <View style={styles.methodActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onEditPayment(method)}
        >
          <Edit2 size={18} color="#94A3B8" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(method.id, method.title)}
        >
          <Trash2 size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={<ChevronLeft size={24} color={colors.text} />}
            onPress={onBack}
            variant="ghost"
          />
          <Text style={styles.headerTitle}>
            MÉTODOS DE <Text style={{ color: colors.primary }}>PAGO</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddPayment}>
          <Plus size={14} color={colors.white} />
          <Text style={styles.addBtnText}>AGREGAR MÉTODO</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          {methods.map((method) => (
            <PaymentMethodItem key={method.id} method={method} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>OTROS MÉTODOS</Text>
          {otherMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodCard}
              activeOpacity={0.7}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View
                style={[
                  styles.methodIconWrapper,
                  { backgroundColor: getIconBg(method.type) },
                ]}
              >
                {getIconForType(method.type)}
              </View>
              <Text style={[styles.methodTitle, { flex: 1 }]}>
                {method.title}
              </Text>
              <View
                style={[
                  styles.radioCircle,
                  selectedMethodId === method.id && styles.radioCircleSelected,
                ]}
              >
                {selectedMethodId === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.securityInfo}>
          <Text style={styles.securityText}>
            Tus datos de pago están protegidos por encriptación de extremo a
            extremo y cumplen con los estándares PCI-DSS.
          </Text>
        </View>
      </ScrollView>

      <DeleteConfirmationModal
        visible={!!methodToDelete}
        methodName={methodToDelete?.title || ""}
        onClose={() => setMethodToDelete(null)}
        onConfirm={confirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 18,
    color: "#0F172A",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  addBtn: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addBtnText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: colors.white,
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 8,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 30,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  methodIconWrapper: {
    width: 48,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  visaIconText: {
    color: "#1D4ED8",
    fontFamily: "Inter_900Black",
    fontSize: 12,
    fontStyle: "italic",
  },
  mastercardIcon: {
    flexDirection: "row",
  },
  mcCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.9,
  },
  yapeIconText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    fontStyle: "italic",
  },
  plinIconText: {
    color: "#FFF",
    fontFamily: "Inter_900Black",
    fontSize: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  googleIconText: {
    color: "#4285F4",
    fontFamily: "Inter_900Black",
    fontSize: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  methodTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#1E293B",
  },
  primaryBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  primaryText: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    color: "#166534",
    textTransform: "uppercase",
  },
  methodSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#64748B",
  },
  methodActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: "#FF4B2B",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF4B2B",
  },
  securityInfo: {
    marginTop: 20,
    paddingHorizontal: 32,
  },
  securityText: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
  },
});
