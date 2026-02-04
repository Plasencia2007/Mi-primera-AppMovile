import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../features/auth/screens/RegisterScreen";
import { useNavigationStore } from "../store/useNavigation";
import { colors } from "../theme";

interface AuthNavigatorProps {
  onLoginSuccess: () => void;
}

export const AuthNavigator = ({ onLoginSuccess }: AuthNavigatorProps) => {
  const { currentScreen, setCurrentScreen } = useNavigationStore();

  if (currentScreen === "REGISTER") {
    return (
      <SafeAreaView style={styles.container}>
        <RegisterScreen
          onRegister={onLoginSuccess}
          onGoToLogin={() => setCurrentScreen("LOGIN")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen
        onLogin={onLoginSuccess}
        onGoToRegister={() => setCurrentScreen("REGISTER")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
