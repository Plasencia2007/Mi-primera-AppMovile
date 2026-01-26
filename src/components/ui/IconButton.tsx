import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  style?: StyleProp<ViewStyle>;
}

export const IconButton = ({ 
  icon, 
  onPress, 
  size = 44, 
  variant = 'ghost', 
  style 
}: IconButtonProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E9ECEF' };
      case 'glass':
        return { backgroundColor: 'rgba(0,0,0,0.3)' };
      default:
        return { backgroundColor: colors.background };
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button, 
        getVariantStyle(), 
        { width: size, height: size, borderRadius: size / 2 },
        style
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
