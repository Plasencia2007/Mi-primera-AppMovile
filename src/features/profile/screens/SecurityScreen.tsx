import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Switch,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  Fingerprint, 
  Smartphone, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme';

const { width } = Dimensions.get('window');

interface SecurityScreenProps {
  onBack: () => void;
  onNavigateToChangePassword: () => void;
  onNavigateToTwoFactor: () => void;
  onNavigateToDevices: () => void;
}

export const SecurityScreen = ({ onBack, onNavigateToChangePassword, onNavigateToTwoFactor, onNavigateToDevices }: SecurityScreenProps) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);

  const SecurityItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    hasToggle = false,
    toggleValue,
    onToggle
  }: any) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      activeOpacity={hasToggle ? 1 : 0.7}
      onPress={hasToggle ? undefined : onPress}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconCircle}>
          <Icon size={24} color={colors.text} />
        </View>
        <View style={styles.itemTexts}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#E2E8F0', true: colors.primary }}
          thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          ios_backgroundColor="#E2E8F0"
        />
      ) : (
        <ChevronRight size={20} color="#94A3B8" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SEGURIDAD</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AJUSTES DE ACCESO</Text>
          
          <SecurityItem 
            icon={Lock}
            title="Cambiar Contraseña"
            subtitle="Actualiza tu clave de acceso"
            onPress={onNavigateToChangePassword}
          />
          
          <SecurityItem 
            icon={ShieldCheck}
            title="Autenticación (2FA)"
            subtitle="Doble capa de protección"
            onPress={onNavigateToTwoFactor}
          />
          
          <SecurityItem 
            icon={Fingerprint}
            title="Acceso Biométrico"
            subtitle="Usar FaceID o TouchID"
            hasToggle={true}
            toggleValue={isBiometricEnabled}
            onToggle={setIsBiometricEnabled}
          />
        </View>

        {/* Devices Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DISPOSITIVOS</Text>
          
          <SecurityItem 
            icon={Smartphone}
            title="Gestionar Dispositivos"
            subtitle="Ver sesiones activas"
            onPress={onNavigateToDevices}
          />
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <ShieldAlert size={20} color={colors.primary} />
            <Text style={styles.statusTitle}>Tu cuenta está protegida</Text>
          </View>
          <Text style={styles.statusMessage}>
            Hemos detectado que tu última sesión fue desde un iPhone 15 Pro en Lima, Perú. Si no fuiste tú, revisa tus dispositivos.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#181111',
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    gap: 12,
    marginBottom: 32,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginLeft: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    paddingRight: 16,
    borderRadius: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTexts: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#181111',
  },
  itemSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  statusCard: {
    backgroundColor: 'rgba(236, 19, 30, 0.08)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(236, 19, 30, 0.15)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  statusTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.primary,
  },
  statusMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(236, 19, 30, 0.8)',
    lineHeight: 18,
  },
});
