import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  MapPin,
  ShoppingBag,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Award,
  HelpCircle,
  Camera,
  Truck,
  Trash2,
  Edit2,
  User,
  Calendar,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { colors, spacing } from "../../../theme";
import { Avatar } from "../../../components/ui/Avatar";
import { useUser } from "../store/useUser";
import { supabase } from "../../../services/supabase";
import { EditProfileModal } from "../components/EditProfileModal";
import { useNotification } from "../../../store/useNotification";

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigateToOrders: () => void;
  onNavigateToAddresses: () => void;
  onNavigateToPayments: () => void;
  onNavigateToSecurity: () => void;
  onNavigateToHelp: () => void;
  onNavigateToActiveOrders: () => void;
  onNavigateToScheduled: () => void;
  onDeleteAccount: () => void;
}

export const ProfileScreen = ({
  onLogout,
  onNavigateToOrders,
  onNavigateToAddresses,
  onNavigateToPayments,
  onNavigateToSecurity,
  onNavigateToHelp,
  onNavigateToActiveOrders,
  onNavigateToScheduled,
  onDeleteAccount,
}: ProfileScreenProps) => {
  const { profile, getInitials, updateAvatar } = useUser();

  const [isUploading, setIsUploading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const showNotification = useNotification((state) => state.showNotification);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        setIsUploading(true);
        // 1. Delete old avatar from storage if it exists (BEFORE uploading new one)
        if (profile.avatar?.uri) {
          try {
            const oldUrl = profile.avatar.uri;
            const bucketPart = "/avatars/";
            const bucketIndex = oldUrl.indexOf(bucketPart);

            if (bucketIndex !== -1) {
              let pathInBucket = oldUrl.substring(
                bucketIndex + bucketPart.length,
              );
              // Remove query parameters (?t=...) to get the exact filename in the bucket
              pathInBucket = pathInBucket.split("?")[0];

              if (pathInBucket) {
                await supabase.storage.from("avatars").remove([pathInBucket]);
              }
            }
          } catch (delError) {
            console.warn("Non-critical error deleting old avatar:", delError);
          }
        }

        const asset = result.assets[0];
        // Dynamic name to ensure it's always "new" for the storage and CDN
        const fileName = `${profile.id}-${Date.now()}.jpg`;
        const filePath = fileName;

        // Prepare the file for upload
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const arrayBuffer = await new Promise<ArrayBuffer>(
          (resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
          },
        );

        // 2. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, arrayBuffer, {
            contentType: asset.mimeType || "image/jpeg",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // 3. Get Public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        const finalUrl = `${publicUrl}?t=${new Date().getTime()}`;

        // 4. Update Profile in Database
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: finalUrl })
          .eq("id", profile.id);

        if (updateError) throw updateError;

        // 5. Update Local State
        updateAvatar({ uri: finalUrl });
        showNotification({
          type: "success",
          title: "¡Listo!",
          message: "Imagen de perfil actualizada correctamente.",
        });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo subir la imagen: " + error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const ProfileOption = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    isLast = false,
    iconBgColor = "#F8FAFC",
    iconColor = colors.textSecondary,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    isLast?: boolean;
    iconBgColor?: string;
    iconColor?: string;
  }) => (
    <>
      <TouchableOpacity
        style={styles.optionItem}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          <Icon size={24} color={iconColor} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color="#CBD5E1" />
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary + "15", "transparent"]}
            style={styles.headerGradient}
          />
          <TouchableOpacity
            style={styles.avatarWrapper}
            activeOpacity={0.8}
            onPress={handlePickImage}
          >
            <Avatar
              source={profile.avatar}
              initials={getInitials()}
              size={120}
              style={styles.avatarMain}
              textStyle={styles.avatarText}
            />
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color={colors.white} size="large" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Camera size={14} color={colors.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.nameHeaderRow}>
            <Text style={styles.userName}>{profile.name}</Text>
            <TouchableOpacity
              style={styles.editIconBadge}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Edit2 size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        {/* Premium Membership Card */}
        <View style={styles.membershipCardContainer}>
          <LinearGradient
            colors={["#1E293B", "#0F172A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.membershipCard}
          >
            <View style={styles.membershipContent}>
              <View style={styles.goldBadge}>
                <Award size={20} color="#0F172A" />
              </View>
              <View style={styles.membershipText}>
                <Text style={styles.memberTitle}>Luxe Gold Member</Text>
                <Text style={styles.memberSubtitle}>
                  PREMIUM BENEFITS ACTIVE
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.white} />
          </LinearGradient>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>GENERAL</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon={User}
              title="Información Personal"
              subtitle="Nombre, DNI, Teléfono..."
              iconBgColor="#F0F9FF"
              iconColor="#0EA5E9"
              onPress={() => setIsEditModalVisible(true)}
            />
            <ProfileOption
              icon={MapPin}
              title="Direcciones"
              subtitle="Gestiona tus puntos de entrega"
              iconBgColor="#EEF2FF"
              iconColor="#4F46E5"
              onPress={onNavigateToAddresses}
            />
            <ProfileOption
              icon={Truck}
              title="Rastrear Pedido"
              subtitle="Pedidos en preparación o camino"
              iconBgColor="#FFF7ED"
              iconColor={colors.primary}
              onPress={onNavigateToActiveOrders}
            />
            <ProfileOption
              icon={Calendar}
              title="Reserva Pedido"
              subtitle="Pedidos programados"
              iconBgColor="#F5F3FF"
              iconColor="#7C3AED"
              onPress={onNavigateToScheduled}
            />
            <ProfileOption
              icon={CreditCard}
              title="Métodos de Pago"
              subtitle="Tarjetas guardadas"
              iconBgColor="#ECFDF5"
              iconColor="#10B981"
              onPress={onNavigateToPayments}
            />
            <ProfileOption
              icon={ShieldCheck}
              title="Seguridad"
              subtitle="Contraseña y privacidad"
              iconBgColor="#EFF6FF"
              iconColor="#3B82F6"
              isLast
              onPress={onNavigateToSecurity}
            />
          </View>
        </View>

        {/* Advanced Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>AVANZADO</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon={Settings}
              title="Configuración"
              subtitle="Preferencias de la aplicación"
              iconBgColor="#F1F5F9"
              iconColor="#475569"
            />
            <ProfileOption
              icon={HelpCircle}
              title="Centro de Ayuda"
              subtitle="Soporte y preguntas frecuentes"
              iconBgColor="#F1F5F9"
              iconColor="#475569"
              isLast
              onPress={onNavigateToHelp}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={colors.primary} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                marginTop: 12,
                borderColor: "#FEE2E2",
                backgroundColor: "#FEF2F2",
              },
            ]}
            onPress={onDeleteAccount}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={[styles.logoutText, { color: "#EF4444" }]}>
              Eliminar Cuenta
            </Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>VERSIÓN 1.0.2 PREMIUM EDITION</Text>
        </View>
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: "center",
    position: "relative",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatarMain: {
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  avatarText: {
    fontSize: 40,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 30,
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  userEmail: {
    fontFamily: "Inter_500Medium",
    fontSize: 17,
    color: "#64748B",
    marginTop: 2,
  },
  nameHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIconBadge: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  membershipCardContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  membershipCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  membershipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  goldBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FBBF24",
    justifyContent: "center",
    alignItems: "center",
  },
  membershipText: {
    marginLeft: 12,
  },
  memberTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  memberSubtitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 1,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 8,
  },
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: "#0F172A",
  },
  optionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    backgroundColor: "#FFFFFF",
  },
  logoutText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#64748B",
    letterSpacing: 1.5,
    marginTop: 24,
  },
});
