import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { ChevronLeft, Camera, Save, Rss, Lock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cardValidator from "card-validator";
import { colors } from "../../../theme";
import { IconButton } from "../../../components/ui/IconButton";
import { usePayments } from "../store/usePayments";
import { SuccessModal } from "../../../components/modals/SuccessModal";
import { PaymentMethod } from "../../../types/payment.types";
import { paymentSchema, PaymentFormData } from "../validation/paymentSchemas";

interface AddPaymentMethodScreenProps {
  onBack: () => void;
  paymentToEdit?: PaymentMethod;
}

interface ControlledInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string;
  iconRight?: any;
  showIcon?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "numeric" | "phone-pad";
  width?: string;
  editable?: boolean;
}

const ControlledInputField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  iconRight: IconRight,
  showIcon = false,
  maxLength,
  keyboardType = "default",
  width = "100%",
  editable = true,
}: ControlledInputFieldProps) => (
  <View style={[styles.inputGroup, { width: width as any }]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View
      style={[
        styles.inputContainer,
        !!error && styles.inputContainerError,
        !editable && styles.inputContainerReadOnly,
      ]}
    >
      <TextInput
        style={[styles.input, !editable && styles.inputReadOnly]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        maxLength={maxLength}
        keyboardType={keyboardType}
        editable={editable}
      />
      {showIcon && IconRight && (
        <View style={!editable && { opacity: 0.5 }}>
          <IconRight
            size={20}
            color={error ? "#EF4444" : !editable ? "#94A3B8" : "#FF6347"}
          />
        </View>
      )}
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// Standardized card formats
const cardNumberValidator = (value: string) => {
  const cleaned = value.replace(/\s/g, "");
  return /^\d{13,19}$/.test(cleaned);
};

const expiryValidator = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.length === 4;
};

export const AddPaymentMethodScreen = ({
  onBack,
  paymentToEdit,
}: AddPaymentMethodScreenProps) => {
  const { addMethod, updateMethod } = usePayments();
  const isEditing = !!paymentToEdit;

  const [activeTab, setActiveTab] = useState<"TARJETA" | "YAPE" | "PLIN">(
    () => {
      if (!paymentToEdit) return "TARJETA";
      if (paymentToEdit.type === "VISA" || paymentToEdit.type === "MASTERCARD")
        return "TARJETA";
      return paymentToEdit.type as any;
    },
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Single stable form
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "all",
    defaultValues: {
      cardHolder: paymentToEdit?.details?.ownerName || "",
      cardNumber: paymentToEdit?.details?.lastFour
        ? `0000 0000 0000 ${paymentToEdit.details.lastFour}`
        : "",
      expiry: paymentToEdit?.details?.expiryDate || "",
      cvv: "",
      phoneNumber: paymentToEdit?.details?.phoneNumber || "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = form;

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(" ") : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const matched = cleaned.match(/.{1,3}/g);
    return matched ? matched.join(" ") : cleaned;
  };

  const getCardType = (cardNumber: string): "VISA" | "MASTERCARD" => {
    const validation = cardValidator.number(cardNumber.replace(/\s/g, ""));
    if (validation.card?.type === "visa") return "VISA";
    if (validation.card?.type === "mastercard") return "MASTERCARD";
    return cardNumber.startsWith("4") ? "VISA" : "MASTERCARD";
  };

  const [isLoading, setIsLoading] = useState(false);

  const onValidSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    try {
      if (activeTab === "TARJETA") {
        const cleanCard = (data.cardNumber || "").replace(/\s/g, "");

        // Strict Validations for Card
        if (!cardNumberValidator(cleanCard)) {
          setError("cardNumber", { message: "Número de tarjeta inválido" });
          setIsLoading(false);
          return;
        }
        if (!expiryValidator(data.expiry || "")) {
          setError("expiry", { message: "Fomato MM/AA inválido" });
          setIsLoading(false);
          return;
        }
        if ((data.cvv || "").length < 3) {
          setError("cvv", { message: "CVV inválido (min 3 dígitos)" });
          setIsLoading(false);
          return;
        }
        if (!data.cardHolder || data.cardHolder.trim().length < 3) {
          setError("cardHolder", { message: "Nombre del titular requerido" });
          setIsLoading(false);
          return;
        }

        const lastFour = cleanCard.slice(-4);
        const type = getCardType(data.cardNumber || "");

        if (isEditing) {
          await updateMethod(paymentToEdit.id, {
            type,
            details: {
              ...paymentToEdit.details,
              lastFour,
              expiryDate: data.expiry || "",
              ownerName: data.cardHolder || "",
            },
          });
        } else {
          await addMethod({
            type,
            title: `•••• ${lastFour}`,
            isPrimary: false,
            details: {
              lastFour,
              expiryDate: data.expiry || "",
              ownerName: data.cardHolder || "",
            },
          });
        }
      } else {
        // Validation for Yape/Plin
        if (!data.cardHolder || data.cardHolder.trim().length < 3) {
          setError("cardHolder", {
            message: "Ingrese el nombre del titular (mín. 3 caracteres)",
          });
          setIsLoading(false);
          return;
        }

        const cleanPhone = (data.phoneNumber || "").replace(/\D/g, "");
        if (cleanPhone.length !== 9 || !cleanPhone.startsWith("9")) {
          setError("phoneNumber", {
            message: "El número debe ser de 9 dígitos y empezar con 9",
          });
          setIsLoading(false);
          return;
        }

        const updatedMethodData = {
          type: activeTab as any,
          title: formatPhoneNumber(data.phoneNumber || ""),
          subtitle: `Asociado a ${data.cardHolder}`,
          details: {
            phoneNumber: cleanPhone,
            ownerName: data.cardHolder || "",
          },
        };

        if (isEditing) {
          await updateMethod(paymentToEdit.id, updatedMethodData);
        } else {
          await addMethod({
            ...updatedMethodData,
            isPrimary: false,
          });
        }
      }

      // Success! Show modal
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Error saving payment method:", error);
      // Handle error notification if needed, but the store already logs it
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    handleSubmit(onValidSubmit)();
  };

  // Switch tabs and reset form partially
  const handleTabChange = (tab: "TARJETA" | "YAPE" | "PLIN") => {
    setActiveTab(tab);
    // Optional: reset({ ...form.getValues(), phoneNumber: '', cardNumber: '' });
  };

  const currentCardNumber = watch("cardNumber") || "";
  const currentExpiry = watch("expiry") || "";
  const currentCardHolder = watch("cardHolder") || "";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <IconButton
          icon={<ChevronLeft size={24} color={colors.text} />}
          onPress={onBack}
          variant="ghost"
        />
        <Text style={styles.headerTitle}>
          {isEditing ? "EDITAR" : "AGREGAR"}{" "}
          <Text style={{ color: colors.primary }}>MÉTODO</Text>
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Segmented Tabs */}
        <View style={styles.tabsContainer}>
          {["TARJETA", "YAPE", "PLIN"]
            .filter((tab) => !isEditing || tab === activeTab)
            .map((tab) => (
              <TouchableOpacity
                key={tab}
                disabled={isEditing}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => handleTabChange(tab as any)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          {/* Common Holder Name Field - Stabilized */}
          <Controller
            control={control}
            name="cardHolder"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <ControlledInputField
                label="Nombre del titular"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={
                  activeTab === "TARJETA"
                    ? "Nombre como figura en la tarjeta"
                    : "Nombre del titular de la cuenta"
                }
                error={error?.message}
              />
            )}
          />

          {activeTab === "TARJETA" ? (
            <View key="tarjeta-fields">
              <Controller
                control={control}
                name="cardNumber"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <ControlledInputField
                    label="Número de tarjeta"
                    value={
                      isEditing
                        ? `•••• •••• •••• ${paymentToEdit.details.lastFour}`
                        : formatCardNumber(value || "")
                    }
                    onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                    onBlur={onBlur}
                    placeholder="0000 0000 0000 0000"
                    error={error?.message}
                    iconRight={isEditing ? Lock : Camera}
                    showIcon
                    maxLength={19}
                    keyboardType="numeric"
                    editable={!isEditing}
                  />
                )}
              />
              <View style={styles.row}>
                <Controller
                  control={control}
                  name="expiry"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <ControlledInputField
                      label="Vencimiento"
                      value={formatExpiry(value || "")}
                      onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                      onBlur={onBlur}
                      placeholder="MM/AA"
                      error={error?.message}
                      maxLength={5}
                      keyboardType="numeric"
                      width="48%"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="cvv"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <ControlledInputField
                      label="CVV"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="000"
                      error={error?.message}
                      maxLength={4}
                      keyboardType="numeric"
                      width="48%"
                    />
                  )}
                />
              </View>
            </View>
          ) : (
            <View key="digital-fields">
              <Controller
                control={control}
                name="phoneNumber"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <ControlledInputField
                    label="Número de celular"
                    value={formatPhoneNumber(value || "")}
                    onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                    onBlur={onBlur}
                    placeholder="999 999 999"
                    error={error?.message}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                )}
              />
            </View>
          )}
        </View>

        {/* Card Preview */}
        {activeTab === "TARJETA" && (
          <LinearGradient
            colors={["#FF8A65", "#FF5722"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardPreview}
          >
            <View style={styles.cardPreviewContent}>
              <View style={styles.cardTop}>
                <View style={styles.chipContainer}>
                  <View style={styles.chip} />
                  <Text style={styles.chipText}>CHIP INTELIGENTE</Text>
                </View>
                <Rss
                  size={24}
                  color="rgba(255,255,255,0.8)"
                  style={styles.contactlessIcon}
                />
              </View>

              <Text style={styles.previewNumber}>
                {formatCardNumber(currentCardNumber) || "•••• •••• •••• ••••"}
              </Text>

              <View style={styles.previewFooter}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewValue}>
                    {currentCardHolder.toUpperCase() || "NOMBRE DEL TITULAR"}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.previewLabel}>VENCE</Text>
                  <Text style={styles.previewValue}>
                    {formatExpiry(currentExpiry) || "00/00"}
                  </Text>
                </View>
              </View>

              {/* Decorative elements */}
              <View style={styles.cardDecorative} />
            </View>
          </LinearGradient>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Save size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>
            {isEditing ? "ACTUALIZAR MÉTODO" : "GUARDAR MÉTODO"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        title={isEditing ? "¡Método Actualizado!" : "¡Método Guardado!"}
        message={
          isEditing
            ? "Los cambios han sido guardados correctamente."
            : "Tu método de pago ha sido vinculado correctamente a tu cuenta."
        }
        onClose={onBack}
        autoCloseDelay={2000}
      />
    </KeyboardAvoidingView>
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
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 10 : 0, // App.tsx handles safe area
    paddingBottom: 20,
    backgroundColor: "#F8F8F8",
  },
  headerTitle: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 18,
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#E8E4E1",
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#94A3B8",
  },
  activeTabText: {
    color: "#0F172A",
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  inputContainerError: {
    borderColor: "#EF4444",
  },
  inputContainerReadOnly: {
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
  },
  input: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: "#0F172A",
    paddingVertical: Platform.OS === "android" ? 4 : 0,
  },
  inputReadOnly: {
    color: "#94A3B8",
  },
  errorText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#EF4444",
    marginTop: 6,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardPreview: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    minHeight: 200,
  },
  cardPreviewContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    marginRight: 8,
  },
  chipText: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 0.5,
  },
  contactlessIcon: {
    transform: [{ rotate: "90deg" }],
  },
  previewNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 24,
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  previewLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  previewValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  cardDecorative: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 30,
  },
  saveButtonText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 14,
    color: colors.white,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
});
