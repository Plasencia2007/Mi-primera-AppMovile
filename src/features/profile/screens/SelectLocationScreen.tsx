import React, { useState, useRef, useEffect } from 'react';
import MapWrapper, { PROVIDER_GOOGLE } from '../../../components/Map/MapWrapper';
import * as Location from 'expo-location';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  Image, 
  Dimensions,
  StatusBar as RNStatusBar,
  Alert
} from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Plus, 
  Minus, 
  LocateFixed,
  Map as MapIcon
} from 'lucide-react-native';
import { colors } from '../../../theme';

const { width, height } = Dimensions.get('window');

interface SelectLocationScreenProps {
  onBack: () => void;
  onConfirm: (location: any) => void;
  initialAddress?: string;
}

export const SelectLocationScreen = ({ onBack, onConfirm, initialAddress = "Cargando dirección..." }: SelectLocationScreenProps) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [subAddress, setSubAddress] = useState("Detectando ubicación...");
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState({
    latitude: -12.046374, // Lima, Perú
    longitude: -77.042793,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const mapRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const currentRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(currentRegion);
      mapRef.current?.animateToRegion(currentRegion, 1000);
      updateAddress(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const updateAddress = async (lat: number, lng: number) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        
        const street = addr.street || addr.name || '';
        const num = addr.streetNumber ? ` ${addr.streetNumber}` : '';
        const dist = addr.district || addr.subregion || '';
        const cty = addr.city || addr.region || '';
        
        let fullAddr = `${street}${num}`.trim();
        let secondary = [dist, cty].filter(Boolean).join(', ');
        
        setSearchQuery(fullAddr || 'Ubicación seleccionada');
        setSubAddress(secondary || 'Perú');
        setDistrict(dist);
        setCity(cty);
      }
    } catch (e) {
      console.log('Error reverse geocoding');
    }
  };

  const handleZoom = (type: 'in' | 'out') => {
    const delta = type === 'in' ? region.latitudeDelta / 2 : region.latitudeDelta * 2;
    const newRegion = { ...region, latitudeDelta: delta, longitudeDelta: delta };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleCenter = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Necesitamos permisos de ubicación');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const currentRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setRegion(currentRegion);
    mapRef.current?.animateToRegion(currentRegion, 300);
    updateAddress(location.coords.latitude, location.coords.longitude);
  };

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="dark-content" />
      
      {/* Real Map Layer */}
      <View style={styles.mapBackground}>
        <MapWrapper
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          onRegionChangeComplete={(newRegion: any) => {
            setRegion(newRegion);
            updateAddress(newRegion.latitude, newRegion.longitude);
          }}
          showsUserLocation
          showsPointsOfInterest={false}
          showsBuildings={true}
        />
      </View>

      {/* Top Floating AppBar & Search */}
      <View style={styles.topContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft size={24} color="#181111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajustar Ubicación</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconWrapper}>
              <Search size={22} color={colors.primary} />
            </View>
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar una nueva dirección..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* Central Static Pin Overlay */}
      <View style={styles.centerPinContainer} pointerEvents="none">
        {/* Tooltip */}
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>ENTREGAR AQUÍ</Text>
        </View>
        
        {/* Pin Shadow Inner Box for alignment */}
        <View style={styles.pinWrapper}>
          <MapPin size={56} color={colors.primary} fill={colors.primary} strokeWidth={1} />
        </View>
        
        {/* Drop shadow dot on map */}
        <View style={styles.pinShadowDot} />
      </View>

      {/* Re-center and Zoom Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => handleZoom('in')}>
            <Plus size={24} color="#181111" />
          </TouchableOpacity>
          <View style={styles.controlDivider} />
          <TouchableOpacity style={styles.controlBtn} onPress={() => handleZoom('out')}>
            <Minus size={24} color="#181111" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.myLocationBtn} onPress={handleCenter}>
          <LocateFixed size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Address Card (Bottom Sheet) */}
      <View style={styles.bottomCardContainer}>
        <View style={styles.bottomSheetHandle} />
        <View style={styles.bottomSheetContent}>
          {/* Address Info */}
          <View style={styles.addressInfoWrapper}>
            <View style={styles.locationIconBox}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View style={styles.addressTexts}>
              <Text style={styles.addressLabel}>DIRECCIÓN DE ENTREGA</Text>
              <Text style={styles.addressMain} numberOfLines={1}>{searchQuery}</Text>
              <Text style={styles.addressSub} numberOfLines={2}>
                {subAddress}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity 
            style={styles.confirmBtn}
            activeOpacity={0.9}
            onPress={() => onConfirm({ 
              street: searchQuery, 
              district: district, 
              city: city 
            })}
          >
            <Text style={styles.confirmBtnText}>CONFIRMAR UBICACIÓN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    zIndex: 20,
    gap: 12,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 8,
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
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#181111',
    textAlign: 'center',
  },
  searchBarContainer: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  searchIconWrapper: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#181111',
  },
  centerPinContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 80, // Offset to account for bottom sheet
  },
  tooltip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tooltipText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  pinWrapper: {
    marginTop: -8, // Slight overlap
  },
  pinShadowDot: {
    width: 10,
    height: 4,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: -4,
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 300, // Positioned above the bottom card
    zIndex: 20,
    gap: 12,
  },
  zoomControls: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  controlBtn: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 8,
  },
  myLocationBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bottomCardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  bottomSheetHandle: {
    height: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetHandleInner: {
    height: 5,
    width: 40,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  bottomSheetContent: {
    paddingHorizontal: 24,
    gap: 24,
  },
  addressInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  locationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(236, 19, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTexts: {
    flex: 1,
  },
  addressLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  addressMain: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#181111',
    marginBottom: 2,
  },
  addressSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
  },
  confirmBtn: {
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  confirmBtnText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
