import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  Home, 
  Briefcase, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2,
  Star
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme';
import { IconButton } from '../../../components/ui/IconButton';
import { USER_MOCKS } from '../../../data/mocks/user.mocks';
import { Address } from '../../../types/address.types';
import { DeleteConfirmationModal } from '../../../components/modals/DeleteConfirmationModal';

const { width } = Dimensions.get('window');

interface AddressesScreenProps {
  onBack: () => void;
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
  onSelectAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
  addresses: Address[];
}

export const AddressesScreen = ({ onBack, onAddAddress, onEditAddress, onSelectAddress, onDeleteAddress, addresses }: AddressesScreenProps) => {
  const [addressToDelete, setAddressToDelete] = useState<{ id: string, title: string } | null>(null);

  const handleDelete = (id: string, title: string) => {
    setAddressToDelete({ id, title });
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      onDeleteAddress(addressToDelete.id);
      setAddressToDelete(null);
    }
  };



  const getAddressIcon = (title: string, isActive: boolean) => {
    const iconSize = 24;
    const iconColor = isActive ? colors.white : '#94A3B8';
    
    if (title.toLowerCase().includes('casa')) return <Home size={iconSize} color={iconColor} />;
    if (title.toLowerCase().includes('trabajo') || title.toLowerCase().includes('oficina')) return <Briefcase size={iconSize} color={iconColor} />;
    return <MapPin size={iconSize} color={iconColor} />;
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.primary} strokeWidth={3} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MIS DIRECCIONES</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add New Address Section */}
        <TouchableOpacity 
          style={styles.addNewContainer} 
          activeOpacity={0.7}
          onPress={onAddAddress}
        >
          <View style={styles.addIconCircle}>
            <Plus size={24} color={colors.primary} strokeWidth={3} />
          </View>
          <Text style={styles.addNewText}>AGREGAR NUEVA DIRECCIÓN</Text>
        </TouchableOpacity>

        {addresses.map((address: Address) => (
          <TouchableOpacity 
            key={address.id} 
            activeOpacity={0.9}
            onPress={() => onSelectAddress(address.id)}
            style={[
              styles.addressCard,
              address.isDefault && styles.activeCard
            ]}
          >
            {address.isDefault && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ENTREGAR AQUÍ</Text>
              </View>
            )}

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.headerDetails}>
                  <View style={[
                    styles.iconBox,
                    { backgroundColor: address.isDefault ? colors.primary : '#F1F5F9' }
                  ]}>
                    {getAddressIcon(address.title, address.isDefault)}
                  </View>
                  <View>
                    <View style={styles.titleWithStar}>
                      <Text style={styles.addressName}>{address.title}</Text>
                      {address.isDefault && (
                        <Star size={18} color="#EAB308" fill="#EAB308" />
                      )}
                    </View>
                    {address.isDefault && (
                      <Text style={styles.activeStatusText}>DIRECCIÓN ACTIVA</Text>
                    )}
                    {!address.isDefault && address.district && (
                      <Text style={styles.subTitleText}>{address.district}</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.addressDetails}>
                <Text style={styles.streetText}>{address.street}</Text>
                <Text style={styles.cityText}>{address.city}, {address.district}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => onEditAddress(address)}
                >
                  <Edit2 size={18} color={colors.text} />
                  <Text style={styles.editButtonText}>EDITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDelete(address.id, address.title)}
                >
                  <Trash2 size={18} color={colors.primary} />
                  <Text style={styles.deleteButtonText}>ELIMINAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      <DeleteConfirmationModal
        visible={!!addressToDelete}
        methodName={addressToDelete?.title || ''}
        onClose={() => setAddressToDelete(null)}
        onConfirm={confirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  header: {
    backgroundColor: 'rgba(248, 246, 246, 0.8)',
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
    zIndex: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  backButton: {
    width: 40,
    height: 40,
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
    padding: 16,
  },
  addNewContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(236, 19, 30, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  addIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 19, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addNewText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#181111',
    textTransform: 'uppercase',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  activeCard: {
    borderWidth: 2,
    borderColor: 'rgba(236, 19, 30, 0.2)',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  activeBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    zIndex: 10,
  },
  activeBadgeText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titleWithStar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#181111',
    textTransform: 'uppercase',
    marginRight: 8,
    letterSpacing: -0.2,
  },
  activeStatusText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.primary,
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  subTitleText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#896163',
    marginTop: 2,
  },
  addressDetails: {
    marginBottom: 24,
  },
  streetText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#181111',
    lineHeight: 24,
  },
  cityText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#896163',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E6DBDC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#181111',
    letterSpacing: 1,
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(236, 19, 30, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1,
    marginLeft: 8,
  },
});

