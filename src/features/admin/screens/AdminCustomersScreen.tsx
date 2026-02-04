import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  User,
  ShoppingBag,
  CircleDollarSign,
  ChevronRight,
  Filter,
} from "lucide-react-native";
import { colors, spacing } from "../../../theme";
import { useAdmin, AdminCustomer } from "../store/useAdmin";

const { width } = Dimensions.get("window");

interface AdminCustomersScreenProps {
  onBack: () => void;
  onSelectCustomer?: (customer: AdminCustomer) => void;
}

export const AdminCustomersScreen = ({
  onBack,
  onSelectCustomer,
}: AdminCustomersScreenProps) => {
  const insets = useSafeAreaInsets();
  const { customers, isLoading, fetchCustomers } = useAdmin();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const formatMoney = (val: number) => {
    return val.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DIRECTORIO DE CLIENTES</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar Placeholder */}
        <View style={styles.searchBar}>
          <Search size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Buscar por nombre o correo...</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando base de datos...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {customers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              style={styles.customerCard}
              onPress={() => onSelectCustomer?.(customer)}
              activeOpacity={0.7}
            >
              <View style={styles.cardMain}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    {customer.avatar_url ? (
                      <Image
                        source={{ uri: customer.avatar_url }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <User size={24} color="#64748B" />
                    )}
                  </View>
                </View>

                <View style={styles.customerInfo}>
                  <Text style={styles.customerName} numberOfLines={1}>
                    {customer.name}
                  </Text>
                  <Text style={styles.customerEmail} numberOfLines={1}>
                    {customer.email}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statChip}>
                      <ShoppingBag size={12} color="#64748B" />
                      <Text style={styles.statText}>
                        {customer.totalOrders} ped.
                      </Text>
                    </View>
                    <View style={styles.statChip}>
                      <CircleDollarSign size={12} color="#10B981" />
                      <Text style={[styles.statText, { color: "#10B981" }]}>
                        {formatMoney(customer.totalSpent)}
                      </Text>
                    </View>
                  </View>
                </View>

                <ChevronRight size={20} color="#CBD5E1" />
              </View>
            </TouchableOpacity>
          ))}

          {customers.length === 0 && (
            <View style={styles.emptyContainer}>
              <User size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No hay clientes registrados</Text>
              <Text style={styles.emptySubtitle}>
                Los clientes aparecerán aquí una vez realicen su primer pedido.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomColor: "#F1F5F9",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
    marginBottom: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 16,
    color: "#1E293B",
    letterSpacing: 1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#94A3B8",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: "#64748B",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  customerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
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
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: "#1E293B",
  },
  customerEmail: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#64748B",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#1E293B",
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
