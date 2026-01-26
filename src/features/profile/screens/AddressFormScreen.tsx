import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import MapWrapper, { Marker, PROVIDER_GOOGLE } from '../../../components/Map/MapWrapper';
import * as Location from 'expo-location';
import { 
  ArrowLeft, 
  Home, 
  Map as MapIcon, 
  StickyNote, 
  Navigation, 
  Plus, 
  Minus,
  MapPin,
  Info,
  LocateFixed
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme';
import { Address } from '../../../types/address.types';

const { width } = Dimensions.get('window');

interface AddressFormScreenProps {
  onBack: () => void;
  addressToEdit?: Address | null;
  onSave: (address: Partial<Address>) => void;
  onSelectOnMap: () => void;
}

export const AddressFormScreen = ({ onBack, addressToEdit, onSave, onSelectOnMap }: AddressFormScreenProps) => {
  const [formData, setFormData] = useState({
    title: addressToEdit?.title || '',
    street: addressToEdit?.street || '',
    district: addressToEdit?.district || '',
    city: addressToEdit?.city || '',
    reference: addressToEdit?.interior || '' 
  });

  const [region, setRegion] = useState({
    latitude: -12.046374, // Lima, Perú
    longitude: -77.042793,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const mapRef = useRef<any>(null);

  // Auto-complete fields when addressToEdit updates (e.g. from Map Selection)
  useEffect(() => {
    if (addressToEdit) {
      setFormData(prev => ({
        ...prev,
        title: addressToEdit.title || prev.title,
        street: addressToEdit.street || prev.street,
        district: addressToEdit.district || prev.district,
        city: addressToEdit.city || prev.city,
        reference: addressToEdit.interior || prev.reference
      }));
      
      // If coordinates are available in a real app, update region here
    } else {
      // Auto-detect location for new address
      handleCurrentLocation();
    }
  }, [addressToEdit]);

  const handleSave = () => {
    onSave({
      ...addressToEdit,
      title: formData.title,
      street: formData.street,
      district: formData.district,
      city: formData.city,
      interior: formData.reference,
    });
  };

  const handleCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para autocompletar la dirección.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);

      // Reverse geocoding to fill text fields
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        const street = addr.street || addr.name || '';
        const number = addr.streetNumber ? ` ${addr.streetNumber}` : '';
        const district = addr.district || addr.subregion || '';
        const city = addr.city || addr.region || '';
        
        setFormData(prev => ({
          ...prev,
          street: `${street}${number}`.trim(),
          district: district,
          city: city,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No pudimos obtener tu ubicación actual.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={28} color="#181111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{addressToEdit ? 'EDITAR DIRECCIÓN' : 'NUEVA DIRECCIÓN'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Map Section */}
          <View style={styles.mapContainer}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={onSelectOnMap}
              style={styles.mapFrame}
            >
              <View style={styles.mapMock}>
                <MapWrapper
                  ref={mapRef}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                  style={StyleSheet.absoluteFill}
                  region={region}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker coordinate={region}>
                    <View style={styles.markerContainer}>
                      <View style={styles.markerCircle}>
                        <MapPin size={24} color={colors.white} fill={colors.white} />
                      </View>
                    </View>
                  </Marker>
                </MapWrapper>
                
                {/* Overlay Text */}
                <View style={[styles.pinOverlay, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                  <View style={styles.tapToExpand}>
                    <Text style={styles.tapToExpandText}>TOCA PARA AJUSTAR</Text>
                  </View>
                </View>

                {/* Map Controls */}
                <View style={styles.mapControls}>
                  <TouchableOpacity 
                    style={[styles.controlBtn, { backgroundColor: colors.primary }]} 
                    onPress={handleCurrentLocation}
                  >
                    <LocateFixed size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.mapInfo}>
                <Info size={18} color={colors.primary} />
                <Text style={styles.mapInfoText}>
                  La dirección se ajustará automáticamente al mover el punto
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Title Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de la ubicación</Text>
              <View style={styles.inputWrapper}>
                <Home size={20} color="#94A3B8" />
                <TextInput 
                  style={styles.input}
                  placeholder="Ej: Casa, Oficina..."
                  placeholderTextColor="#94A3B8"
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                />
              </View>
            </View>

            {/* Address Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección completa</Text>
              <View style={styles.inputWrapper}>
                <MapIcon size={20} color="#94A3B8" />
                <TextInput 
                  style={styles.input}
                  placeholder="Ingresa tu dirección"
                  placeholderTextColor="#94A3B8"
                  value={formData.street}
                  onChangeText={(text) => setFormData({...formData, street: text})}
                />
              </View>
            </View>

            {/* District & City Row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Distrito</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input}
                    placeholder="Distrito"
                    placeholderTextColor="#94A3B8"
                    value={formData.district}
                    onChangeText={(text) => setFormData({...formData, district: text})}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Provincia</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input}
                    placeholder="Ciudad"
                    placeholderTextColor="#94A3B8"
                    value={formData.city}
                    onChangeText={(text) => setFormData({...formData, city: text})}
                  />
                </View>
              </View>
            </View>

            {/* Reference Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Referencia (opcional)</Text>
              <View style={styles.inputWrapper}>
                <StickyNote size={20} color="#94A3B8" />
                <TextInput 
                  style={styles.input}
                  placeholder="Ej: Portón negro al lado del parque"
                  placeholderTextColor="#94A3B8"
                  value={formData.reference}
                  onChangeText={(text) => setFormData({...formData, reference: text})}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Action */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <Text style={styles.saveBtnText}>GUARDAR CAMBIOS</Text>
          </TouchableOpacity>
          <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 10,
    backgroundColor: '#F8F6F6',
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#181111',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  mapContainer: {
    marginBottom: 24,
  },
  mapFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  mapMock: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E5E7EB',
  },
  pinOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pinCircle: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pinShadow: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 4,
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    gap: 8,
  },
  controlBtn: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  mapInfoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#181111',
    flex: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#181111',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.7,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#181111',
  },
  footer: {
    padding: 24,
    backgroundColor: '#F8F6F6',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  markerCircle: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tapToExpand: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(236, 19, 30, 0.3)',
  },
  tapToExpandText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
});
