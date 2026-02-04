import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { X, User, Phone, CreditCard, MapPin } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { colors, spacing } from "../../../theme";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useUser } from "../store/useUser";
import { supabase } from "../../../services/supabase";
import { useNotification } from "../../../store/useNotification";

const profileSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  phone: z.string().min(9, "Teléfono inválido"),
  dni: z.string().min(8, "DNI inválido").max(8, "DNI inválido"),
  province: z.string().min(2, "Selecciona una provincia"),
  district: z.string().min(2, "Selecciona un distrito"),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({
  isVisible,
  onClose,
}: EditProfileModalProps) => {
  const { profile, updateProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const showNotification = useNotification((state) => state.showNotification);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || "",
      dni: profile.dni || "",
      province: profile.province || "",
      district: profile.district || "",
    },
  });

  React.useEffect(() => {
    if (isVisible) {
      reset({
        name: profile.name,
        phone: profile.phone || "",
        dni: profile.dni || "",
        province: profile.province || "",
        district: profile.district || "",
      });
    }
  }, [isVisible, profile, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          phone: data.phone,
          dni: data.dni,
          province: data.province,
          district: data.district,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      updateProfile(data);
      showNotification({
        type: "success",
        title: "Perfil Actualizado",
        message: "Tus cambios se han guardado correctamente.",
      });
      onClose();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo actualizar el perfil: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="DNI"
                        placeholder="12345678"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        maxLength={8}
                        error={errors.dni?.message}
                        icon={
                          <CreditCard size={20} color={colors.textSecondary} />
                        }
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1.5 }}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Teléfono"
                        placeholder="987654321"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        error={errors.phone?.message}
                        icon={<Phone size={20} color={colors.textSecondary} />}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="province"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Provincia"
                    placeholder="Lima"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.province?.message}
                    icon={<MapPin size={20} color={colors.textSecondary} />}
                  />
                )}
              />

              <Controller
                control={control}
                name="district"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Distrito"
                    placeholder="Miraflores"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.district?.message}
                    icon={<MapPin size={20} color={colors.textSecondary} />}
                  />
                )}
              />

              <Button
                title="Guardar Cambios"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={styles.saveButton}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "85%",
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
    position: "relative",
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: colors.text,
  },
  closeButton: {
    position: "absolute",
    right: 24,
    padding: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  saveButton: {
    marginTop: 20,
  },
});
