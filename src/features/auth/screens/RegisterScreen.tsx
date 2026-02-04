import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Mail, Lock, User, ChevronLeft } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { colors, spacing } from "../../../theme";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

import { supabase } from "../../../services/supabase";
import { useNotification } from "../../../store/useNotification";

const registerSchema = z
  .object({
    name: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Ingresa un correo válido"),
    dni: z.string().min(8, "DNI inválido").max(8, "DNI inválido"),
    phone: z.string().min(9, "Teléfono inválido"),
    province: z.string().min(2, "Selecciona una provincia"),
    district: z.string().min(2, "Selecciona un distrito"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterScreenProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

export const RegisterScreen = ({
  onRegister,
  onGoToLogin,
}: RegisterScreenProps) => {
  const [loading, setLoading] = useState(false);
  const showNotification = useNotification((state) => state.showNotification);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      dni: "",
      phone: "",
      province: "",
      district: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // 1. Sign up user with ALL metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            dni: data.dni,
            phone: data.phone,
            province: data.province,
            district: data.district,
          },
        },
      });

      if (authError) {
        showNotification({
          type: "error",
          title: "Error de Registro",
          message: authError.message,
        });
        return;
      }

      showNotification({
        type: "success",
        title: "¡Bienvenido!",
        message:
          "Tu cuenta ha sido creada con éxito. Ya puedes disfrutar de la app.",
      });
      onRegister();
    } catch (err) {
      showNotification({
        type: "error",
        title: "Error",
        message: "Ocurrió un error inesperado durante el registro.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onGoToLogin} style={styles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>
            Únete a la mejor experiencia gourmet
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Nombre completo"
                placeholder="John Doe"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.name?.message}
                icon={<User size={20} color={colors.textSecondary} />}
              />
            )}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Controller
                control={control}
                name="dni"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    ref={ref}
                    label="DNI"
                    placeholder="12345678"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    maxLength={8}
                    error={errors.dni?.message}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1.5 }}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    ref={ref}
                    label="Teléfono"
                    placeholder="987654321"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                icon={<Mail size={20} color={colors.textSecondary} />}
              />
            )}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Controller
                control={control}
                name="province"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    ref={ref}
                    label="Provincia"
                    placeholder="Lima"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.province?.message}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="district"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    ref={ref}
                    label="Distrito"
                    placeholder="Miraflores"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.district?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Contraseña"
                placeholder="••••••••"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                isPassword
                error={errors.password?.message}
                icon={<Lock size={20} color={colors.textSecondary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Confirmar contraseña"
                placeholder="••••••••"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                isPassword
                error={errors.confirmPassword?.message}
                icon={<Lock size={20} color={colors.textSecondary} />}
              />
            )}
          />

          <Button
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={onGoToLogin}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 30,
    marginLeft: -10,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    color: colors.text,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  registerButton: {
    marginTop: 20,
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 14,
    color: colors.primary,
  },
});
