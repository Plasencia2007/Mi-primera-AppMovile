import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import {
  ChevronLeft,
  MessageSquare,
  Smartphone,
  Check,
} from "lucide-react-native";
import { colors } from "../../../theme";

const { width } = Dimensions.get("window");

interface TwoFactorAuthScreenProps {
  onBack: () => void;
  onNavigateToVerification: () => void;
}

export const TwoFactorAuthScreen = ({
  onBack,
  onNavigateToVerification,
}: TwoFactorAuthScreenProps) => {
  const [selectedMethod, setSelectedMethod] = useState<"SMS" | "APP">("SMS");

  const MethodOption = ({ id, icon: Icon, title, description }: any) => {
    const isSelected = selectedMethod === id;

    return (
      <TouchableOpacity
        style={[styles.methodOption, isSelected && styles.methodOptionSelected]}
        activeOpacity={0.7}
        onPress={() => setSelectedMethod(id)}
      >
        <View style={styles.radioCircle}>
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>{title}</Text>
          <Text style={styles.methodDescription}>{description}</Text>
        </View>
        <View
          style={[
            styles.methodIconBox,
            isSelected && styles.methodIconBoxActive,
          ]}
        >
          <Icon
            size={24}
            color={isSelected ? colors.primary : "rgba(236, 19, 30, 0.4)"}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#181111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AUTENTICACIÓN EN DOS PASOS</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Illustration Section */}
        <View style={styles.heroContainer}>
          <View style={styles.heroBlurBg} />
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY0pjAjzekhvAkFfO0S6lc1-px80bDu36S3FmL5nSdgqRgyFk1oPUvVMn3XYtxzP9QXE40uJB_bMOC7_4fhddV8-ZRB8VfClHgd3xG7MFCM7l1AJ5jZLntqTs6cvpgbG3Id6IgDF7fylGuv1FdgapgO8wzDi9nfQ2_gFnqD8YkGA1zU2JsEQhqr3nnV_2N4bSVaf4Wf3ZkX49xjw-CX1ozIm-zlu5IlCTRXZtiKcRCEZNaMIkZW67YgHpt8SvKuho5cBVU1mtYfSM",
            }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Selection Container */}
        <View style={styles.selectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Método de Verificación</Text>
            <Text style={styles.cardSubtitle}>
              Selecciona cómo deseas recibir tus códigos de seguridad.
            </Text>
          </View>

          <View style={styles.optionsList}>
            <MethodOption
              id="SMS"
              icon={MessageSquare}
              title="Mensaje de Texto (SMS)"
              description="Recibe un código de seguridad en tu móvil."
            />

            <MethodOption
              id="APP"
              icon={Smartphone}
              title="App de Autenticación"
              description="Google Authenticator, Authy o similares."
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.configButton}
          activeOpacity={0.9}
          onPress={onNavigateToVerification}
        >
          <Text style={styles.configButtonText}>CONFIGURAR MÉTODO</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 44 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 10,
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    color: "#181111",
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroContainer: {
    height: 280,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  heroBlurBg: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(236, 19, 30, 0.05)",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  selectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
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
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#181111",
  },
  cardSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  optionsList: {
    gap: 16,
  },
  methodOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6DBDC",
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  methodOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(236, 19, 30, 0.02)",
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E6DBDC",
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#181111",
  },
  methodDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  methodIconBox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  methodIconBoxActive: {
    // optional styling
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  configButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  configButtonText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
