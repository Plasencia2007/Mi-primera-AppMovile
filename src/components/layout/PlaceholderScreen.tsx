import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, Hammer } from 'lucide-react-native';
import { colors, spacing } from '../../theme';

interface PlaceholderScreenProps {
  title: string;
}

export const PlaceholderScreen = ({ title }: PlaceholderScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Hammer size={48} color={colors.primary} />
          <Clock 
            size={24} 
            color={colors.secondary} 
            style={styles.subIcon} 
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Página en construcción</Text>
        <Text style={styles.description}>
          Estamos trabajando para brindarte la mejor experiencia en esta sección. ¡Vuelve pronto!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  subIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
