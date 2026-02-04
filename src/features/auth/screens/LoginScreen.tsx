import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  TextInput,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../../services/supabase";
import { useNotification } from "../../../store/useNotification";

const loginSchema = z.object({
  email: z
    .string()
    .email("Ingresa un correo válido")
    .min(1, "El correo es requerido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginScreenProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

export const LoginScreen = ({ onLogin, onGoToRegister }: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const showNotification = useNotification((state) => state.showNotification);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        showNotification({
          type: "error",
          title: "Error de Acceso",
          message: error.message,
        });
        return;
      }

      onLogin();
    } catch (err) {
      showNotification({
        type: "error",
        title: "Error",
        message: "Ocurrió un error inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1) IMAGEN DE FONDO "NUCLEAR" 
          Posición absoluta con dimensiones exageradas y márgenes negativos
          para cubrir cualquier borde blanco del sistema o padre. 
      */}
      <Image
        source={require("../../../../assets/images/login_bg.png")}
        style={styles.forceFullScreenImage}
        resizeMode="cover"
      />

      {/* 2) Overlay Negro (También oversized) */}
      <View style={styles.overlay} />

      {/* 3) Contenido Seguro Encima */}
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.kav}
        >
          <View style={styles.wrapper}>
            {/* Header Texts */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Bienvenido</Text>
              <Text style={styles.headerSubtitle}>
                Ingredientes frescos, sabor auténtico.
              </Text>
            </View>

            {/* White Card */}
            <View style={styles.card}>
              <View style={styles.form}>
                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="hola@ejemplo.com"
                          placeholderTextColor="#D1D5DB"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="emailAddress"
                        />
                      )}
                    />
                  </View>

                  {!!errors.email?.message && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CONTRASEÑA</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="••••••••"
                          placeholderTextColor="#D1D5DB"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="password"
                        />
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((s) => !s)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#D1D5DB" />
                      ) : (
                        <Eye size={20} color="#D1D5DB" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {!!errors.password?.message && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotText}>
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.buttonWrapper}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#910000", "#D30000"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginButton}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Iniciando..." : "Iniciar Sesión"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>O INGRESA CON</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Buttons */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity
                    style={styles.socialBtn}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
                      }}
                      style={{ width: 22, height: 22 }}
                    />
                    <Text style={styles.socialText}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialBtn}
                    activeOpacity={0.85}
                  >
                    <View style={styles.facebookIcon}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        f
                      </Text>
                    </View>
                    <Text style={styles.socialText}>Facebook</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign Up */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>¿Eres nuevo aquí? </Text>
                  <TouchableOpacity
                    onPress={onGoToRegister}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.signupLink}>Crea una cuenta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Fondo negro detrás para evitar flashes/blancos de wrappers externos
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  // SOLUCIÓN FUERZA BRUTA:
  forceFullScreenImage: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "120%",
    height: "120%",
    // zIndex removed (natural order)
  },

  overlay: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "120%",
    height: "120%",
    backgroundColor: "#000",
    opacity: 0.55,
    // zIndex removed
  },

  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  kav: {
    flex: 1,
    justifyContent: "center",
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  header: {
    marginBottom: 28,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 42,
    fontFamily: "Outfit_700Bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 18,
    fontFamily: "Outfit_300Light",
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    padding: 32,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 24,
  },

  form: {
    gap: 18,
  },

  inputGroup: {
    marginBottom: 2,
  },

  label: {
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    color: "#9CA3AF",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Outfit_400Regular",
    color: "#1F2937",
    padding: 0,
    height: 24,
  },

  errorText: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 12,
    color: "#D30000",
    fontFamily: "Outfit_500Medium",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Outfit_500Medium",
  },

  buttonWrapper: {
    marginTop: 10,
    shadowColor: "#D30000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  loginButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginHorizontal: 16,
  },

  socialContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 12,
  },
  facebookIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1877F2",
    justifyContent: "center",
    alignItems: "center",
  },
  socialText: {
    fontSize: 14,
    fontFamily: "Outfit_600SemiBold",
    color: "#374151",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Outfit_400Regular",
  },
  signupLink: {
    fontSize: 14,
    color: "#D30000",
    fontFamily: "Outfit_700Bold",
  },
});
