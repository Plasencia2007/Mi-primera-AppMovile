import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Mock components for Web to prevent bundling errors
const MapWrapper = React.forwardRef<any, any>((props, ref) => {
  return (
    <View style={[props.style, styles.webMapPlaceholder]}>
      <Text style={styles.webMapText}>Mapa no disponible en Web</Text>
    </View>
  );
});

export const Marker = (props: any) => null;
export const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
  webMapPlaceholder: {
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  }
});

export default MapWrapper;
