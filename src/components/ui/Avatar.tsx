import React from 'react';
import { StyleSheet, Text, View, Image, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme';

interface AvatarProps {
  source?: any;
  initials?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Avatar = ({ 
  source, 
  initials, 
  size = 44, 
  style, 
  textStyle 
}: AvatarProps) => {
  const containerStyle = [
    styles.container, 
    { width: size, height: size, borderRadius: size / 2 },
    style
  ];

  if (source) {
    return (
      <View style={containerStyle}>
        <Image source={source} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={[containerStyle, styles.initialsContainer]}>
      <Text style={[styles.initialsText, { fontSize: size * 0.4 }, textStyle]}>
        {initials || '??'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    backgroundColor: colors.primary,
  },
  initialsText: {
    fontFamily: 'Outfit_700Bold',
    color: colors.white,
  },
});
