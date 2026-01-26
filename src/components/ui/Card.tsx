import { StyleSheet, View, ViewStyle, Platform, StyleProp } from 'react-native';
import { colors } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

export const Card = ({ children, style, noPadding = false }: CardProps) => {
  return (
    <View style={[
      styles.card, 
      !noPadding ? styles.padding : null,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  padding: {
    padding: 16,
  },
});
