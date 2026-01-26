import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../../theme';
import { Badge } from '../../../components/ui/Badge';

export const HeroSection = () => {
  return (
    <View style={styles.heroContainer}>
      <Image 
        source={require('../../../../assets/images/burger.png')} 
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.heroOverlay}
      >
        <View style={styles.heroContent}>
          <Badge 
            label="50% DSCTO PRIMER PEDIDO" 
            variant="secondary" 
            style={styles.promoBadge} 
            textStyle={styles.promoText}
          />
          <Text style={styles.heroTitle}>Sabor Gourmet en cada bocado</Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Ordenar Ahora</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    margin: spacing.md,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  promoBadge: {
    marginBottom: 8,
  },
  promoText: {
    fontFamily: 'Outfit_700Bold',
  },
  heroTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: colors.white,
    marginBottom: 12,
  },
  heroButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: colors.white,
  },
});
