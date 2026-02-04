import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { ChevronLeft, ShieldCheck } from "lucide-react-native";
import { colors } from "../../../theme";
import { useNotification } from "../../../store/useNotification";

const { width } = Dimensions.get("window");

interface VerificationScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const VerificationScreen = ({
  onBack,
  onSuccess,
}: VerificationScreenProps) => {
  const showNotification = useNotification((state) => state.showNotification);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChangeCode = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedCode = text.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setCode(newCode);
      if (index + pastedCode.length < 6) {
        inputs.current[index + pastedCode.length]?.focus();
      } else {
        inputs.current[5]?.blur();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (code.some((c) => c === "")) {
      showNotification({
        type: "warning",
        title: "Código Incompleto",
        message: "Por favor ingresa los 6 dígitos.",
      });
      return;
    }

    showNotification({
      type: "success",
      title: "¡Verificación Exitosa!",
      message: "Tu cuenta ahora cuenta con doble capa de seguridad.",
    });
    onSuccess();
  };

  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#181111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VERIFICACIÓN</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.textSection}>
            <Text style={styles.title}>VERIFICAR CÓDIGO</Text>
            <Text style={styles.subtitle}>
              Ingresa el código de 6 dígitos enviado a su correo o celular
            </Text>
          </View>

          {/* Code Inputs */}
          <View style={styles.inputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputActive : null,
                ]}
                value={digit}
                onChangeText={(text) => handleChangeCode(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={6} // Allow paste but handle it in onChange
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Timer */}
          <TouchableOpacity disabled={timer > 0} onPress={() => setTimer(59)}>
            <Text style={[styles.timerText, timer === 0 && styles.timerActive]}>
              {timer > 0
                ? `Reenviar código en 00:${timer.toString().padStart(2, "0")}`
                : "Reenviar código"}
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          {/* Illustration Place */}
          <View style={styles.illustrationContainer}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={64} color={colors.primary} />
            </View>
          </View>

          {/* Primary Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            activeOpacity={0.9}
            onPress={handleVerify}
          >
            <Text style={styles.verifyButtonText}>VERIFICAR Y ACTIVAR</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "ios" ? 44 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 10,
    backgroundColor: "#FFFFFF", // To cover blobs if needed, or make transparent
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
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  textSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: "#181111",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6DBDC",
    backgroundColor: "#FFFFFF",
    fontFamily: "Outfit_600SemiBold",
    fontSize: 20,
    color: "#181111",
    textAlign: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  codeInputActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  timerText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#896163",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  timerActive: {
    color: colors.primary,
  },
  spacer: {
    flex: 1,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(236, 19, 30, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 24,
  },
  verifyButtonText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  blobTop: {
    position: "absolute",
    top: 40,
    right: 40,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: colors.primary,
    opacity: 0.03,
    transform: [{ scale: 1.5 }],
  },
  blobBottom: {
    position: "absolute",
    bottom: 40,
    left: 40,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: colors.primary,
    opacity: 0.03,
    transform: [{ scale: 1.5 }],
  },
});
