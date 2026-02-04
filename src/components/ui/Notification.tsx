import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react-native";
import { colors } from "../../theme";
import { useNotification } from "../../store/useNotification";

const { width } = Dimensions.get("window");

export const Notification = () => {
  const { visible, type, title, message, hideNotification } = useNotification();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [isRendered, setIsRendered] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      // Animation In
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: Platform.OS === "ios" ? 60 : 40,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRendered(false);
      hideNotification();
    });
  };

  if (!isRendered) return null;

  const getTheme = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 size={24} color="#10B981" />,
          bgColor: "#F0FDF4",
          borderColor: "#BBF7D0",
          titleColor: "#166534",
        };
      case "error":
        return {
          icon: <AlertCircle size={24} color="#EF4444" />,
          bgColor: "#FEF2F2",
          borderColor: "#FECACA",
          titleColor: "#991B1B",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={24} color="#F59E0B" />,
          bgColor: "#FFFBEB",
          borderColor: "#FEF3C7",
          titleColor: "#92400E",
        };
      default:
        return {
          icon: <Info size={24} color="#3B82F6" />,
          bgColor: "#EFF6FF",
          borderColor: "#DBEAFE",
          titleColor: "#1E40AF",
        };
    }
  };

  const theme = getTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor: theme.bgColor,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{theme.icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.titleColor }]}>
            {title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 15,
    marginBottom: 2,
  },
  message: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#64748B",
  },
  closeButton: {
    padding: 4,
  },
});
