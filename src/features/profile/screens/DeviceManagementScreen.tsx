import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { 
  ChevronLeft, 
  Smartphone, 
  Laptop, 
  MapPin, 
  Clock,
  LogOut,
  Shield
} from 'lucide-react-native';
import { colors } from '../../../theme';

const { width } = Dimensions.get('window');

interface DeviceManagementScreenProps {
  onBack: () => void;
}

interface Session {
  id: string;
  device: string;
  type: 'mobile' | 'desktop';
  location: string;
  lastActive: string;
  isCurrent?: boolean;
}

export const DeviceManagementScreen = ({ onBack }: DeviceManagementScreenProps) => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'iPhone 15 Pro',
      type: 'mobile',
      location: 'Lima, Perú',
      lastActive: 'Activo ahora',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'MacBook Pro M2',
      type: 'desktop',
      location: 'Lima, Perú',
      lastActive: 'Hace 2 horas',
    },
    {
      id: '3',
      device: 'Chrome en Windows',
      type: 'desktop',
      location: 'Arequipa, Perú',
      lastActive: 'Hace 5 días',
    }
  ]);

  const handleRevoke = (id: string, deviceName: string) => {
    Alert.alert(
      "Cerrar sesión",
      `¿Estás seguro de que quieres cerrar la sesión en "${deviceName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar sesión", 
          style: "destructive",
          onPress: () => {
             setSessions(prev => prev.filter(s => s.id !== id));
          }
        }
      ]
    );
  };

  const SessionItem = ({ session }: { session: Session }) => {
    const Icon = session.type === 'mobile' ? Smartphone : Laptop;
    
    return (
      <View style={[styles.sessionCard, session.isCurrent && styles.currentSessionCard]}>
        <View style={styles.cardHeader}>
          <View style={[
            styles.iconBox,
            session.isCurrent ? styles.activeIconBox : styles.inactiveIconBox
          ]}>
            <Icon 
              size={24} 
              color={session.isCurrent ? colors.primary : '#64748B'} 
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.deviceName}>{session.device}</Text>
            {session.isCurrent && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ESTE DISPOSITIVO</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
             <MapPin size={14} color="#94A3B8" />
             <Text style={styles.detailText}>{session.location}</Text>
          </View>
          <View style={styles.detailRow}>
             <Clock size={14} color="#94A3B8" />
             <Text style={styles.detailText}>{session.lastActive}</Text>
          </View>
        </View>

        {!session.isCurrent && (
          <TouchableOpacity 
            style={styles.revokeButton}
            onPress={() => handleRevoke(session.id, session.device)}
          >
            <LogOut size={16} color="#EF4444" />
            <Text style={styles.revokeText}>Cerrar sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#181111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DISPOSITIVOS</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoSection}>
          <Shield size={32} color={colors.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.infoTitle}>Sesiones Activas</Text>
          <Text style={styles.infoText}>
            Si ves un dispositivo que no reconoces, cierra la sesión y cambia tu contraseña inmediatamente.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {sessions.map(session => (
            <SessionItem key={session.id} session={session} />
          ))}
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#181111',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: '#181111',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    gap: 16,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  currentSessionCard: {
    borderColor: 'rgba(236, 19, 30, 0.2)',
    backgroundColor: '#FFF5F5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activeIconBox: {
    backgroundColor: '#FFFFFF',
  },
  inactiveIconBox: {
    backgroundColor: '#F8F6F6',
  },
  headerInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#181111',
  },
  badge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  badgeText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#64748B',
  },
  revokeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    gap: 8,
  },
  revokeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: '#EF4444',
  }
});
