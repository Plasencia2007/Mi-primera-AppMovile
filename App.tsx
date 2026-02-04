import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Platform,
  View,
  BackHandler,
  PanResponder,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from "@expo-google-fonts/outfit";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { colors } from "./src/theme";
import { BottomNav } from "./src/components/layout/BottomNav";
import { useAddresses } from "./src/features/profile/store/useAddresses";
import { usePayments } from "./src/features/payments/store/usePayments";
import { useUser } from "./src/features/profile/store/useUser";
import { useNotification } from "./src/store/useNotification";
import { Notification } from "./src/components/ui/Notification";
import { useNavigationStore } from "./src/store/useNavigation";
import { supabase } from "./src/services/supabase";

import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { MainNavigator } from "./src/navigation/MainNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    goBack,
    activeTab,
    setActiveTab,
    selectedProduct,
    isViewingCart,
    setCurrentScreen,
    resetToMain,
  } = useNavigationStore();

  const setProfile = useUser((state) => state.setProfile);
  const profileData = useUser((state) => state.profile);
  const fetchAddresses = useAddresses((state) => state.fetchAddresses);
  const fetchMethods = usePayments((state) => state.fetchMethods);
  const showNotification = useNotification((state) => state.showNotification);

  const backActionRef = useRef<() => boolean>(() => false);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          name: data.full_name || "Usuario",
          email: email,
          avatar: data.avatar_url ? { uri: data.avatar_url } : null,
          points: 0,
          role: data.role || "customer",
          phone: data.phone || "",
          dni: data.dni || "",
          province: data.province || "",
          district: data.district || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      showNotification({
        type: "error",
        title: "Error de Perfil",
        message: "No se pudo cargar tu información: " + error.message,
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentScreen("MAIN");
        fetchUserProfile(session.user.id, session.user.email || "");
        fetchAddresses();
        fetchMethods();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentScreen("MAIN");
        fetchUserProfile(session.user.id, session.user.email || "");
        fetchAddresses();
        fetchMethods();
      } else {
        setIsAuthenticated(false);
        setCurrentScreen("LOGIN");
        setProfile({
          id: "",
          name: "",
          email: "",
          avatar: null,
          points: 0,
          role: "customer",
        });
        resetToMain();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    backActionRef.current = goBack;
  }, [goBack]);

  useEffect(() => {
    const handleBack = () => backActionRef.current();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack,
    );
    return () => backHandler.remove();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Platform.OS === "ios" &&
          evt.nativeEvent.pageX < 40 &&
          gestureState.dx > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 80) {
          backActionRef.current();
        }
      },
    }),
  ).current;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            Alert.alert(
              "Última advertencia",
              "Todos tus pedidos, direcciones y datos de perfil serán eliminados permanentemente.",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar Definitivamente",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const {
                        data: { user },
                      } = await supabase.auth.getUser();
                      if (!user) return;

                      if (profileData.avatar?.uri) {
                        const oldUrl = profileData.avatar.uri;
                        const bucketPart = "/avatars/";
                        const bucketIndex = oldUrl.indexOf(bucketPart);

                        if (bucketIndex !== -1) {
                          const pathInBucket = oldUrl.substring(
                            bucketIndex + bucketPart.length,
                          );
                          if (pathInBucket) {
                            await supabase.storage
                              .from("avatars")
                              .remove([pathInBucket]);
                          }
                        }
                      }

                      const { error: rpcError } = await supabase.rpc(
                        "delete_user_account",
                      );
                      if (rpcError) throw rpcError;

                      await supabase.auth.signOut();

                      showNotification({
                        type: "success",
                        title: "Cuenta eliminada",
                        message: "Tu cuenta ha sido eliminada correctamente.",
                      });
                    } catch (error: any) {
                      console.error("Error deleting account:", error);
                      showNotification({
                        type: "error",
                        title: "Error",
                        message:
                          "No se pudo eliminar la cuenta: " + error.message,
                      });
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: !isAuthenticated ? "#000000" : colors.white,
        }}
        {...panResponder.panHandlers}
      >
        <StatusBar
          style={!isAuthenticated ? "light" : "dark"}
          translucent
          backgroundColor="transparent"
        />

        <Notification />

        {!isAuthenticated ? (
          <AuthNavigator
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              setCurrentScreen("MAIN");
            }}
          />
        ) : (
          <>
            <SafeAreaView
              style={styles.container}
              edges={["top", "left", "right"]}
            >
              <MainNavigator
                handleLogout={handleLogout}
                handleDeleteAccount={handleDeleteAccount}
              />
            </SafeAreaView>

            {!selectedProduct && !isViewingCart && (
              <SafeAreaView
                edges={["bottom"]}
                style={{ backgroundColor: colors.white }}
              >
                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
              </SafeAreaView>
            )}
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
