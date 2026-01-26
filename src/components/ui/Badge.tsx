import { StyleSheet, Text, View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { colors } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'glass';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge = ({ label, variant = 'primary', style, textStyle }: BadgeProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'dark':
        return { backgroundColor: 'rgba(0,0,0,0.6)' };
      case 'glass':
        return { backgroundColor: 'rgba(255,255,255,0.2)' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') return colors.text;
    return colors.white;
  };

  if (!label) return null;

  return (
    <View style={[styles.badge, getVariantStyle(), style]}>
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    fontWeight: '600',
  },
});
