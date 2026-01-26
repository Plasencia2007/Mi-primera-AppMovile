import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { colors } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style,
  textStyle
}: ButtonProps) => {
  const getVariantStyle = () => {
    if (disabled) return styles.disabled;
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'secondary':
        return colors.text;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.textSecondary;
      default:
        return colors.white;
    }
  };

  const isButtonDisabled = disabled || loading ? true : false;
  const isLoading = loading ? true : false;

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[styles.button, getVariantStyle(), style]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  text: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#E9ECEF',
  },
});
