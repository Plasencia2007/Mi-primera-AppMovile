import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Platform
} from 'react-native';
import { Bell, ChevronDown, MapPin, X, CheckCircle2, ShoppingBag } from 'lucide-react-native';
import { colors, spacing } from '../../theme';
import { IconButton } from '../ui/IconButton';
import { Avatar } from '../ui/Avatar';
import { useUser } from '../../features/profile/store/useUser';
import { useCart } from '../../features/cart/store/useCart';
import { useAddresses } from '../../features/profile/store/useAddresses';
import { CartDrawer } from '../cart/CartDrawer';

interface HeaderProps {
  onViewCart?: () => void;
}

export const Header = ({ onViewCart }: HeaderProps) => {
  const { profile, getInitials } = useUser();
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());
  
  // Use global address store
  const addresses = useAddresses((state) => state.addresses);
  const selectedAddressId = useAddresses((state) => state.selectedAddressId);
  const setSelectedAddress = useAddresses((state) => state.setSelectedAddress);

  const userFirstName = profile.name.split(' ')[0];
  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId) || addresses[0];
  const addressLabel = selectedAddress ? `${selectedAddress.title}, ${selectedAddress.city}` : 'Sin dirección';

  const renderAddressItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.addressItem,
        item.id === selectedAddressId && styles.activeAddressItem
      ]}
      onPress={() => {
        setSelectedAddress(item.id);
        setIsAddressModalVisible(false);
      }}
    >
      <View style={styles.addressItemLeft}>
        <View style={[
          styles.addressIconWrapper,
          item.id === selectedAddressId ? styles.activeIconWrapper : null
        ]}>
          <MapPin size={20} color={item.id === selectedAddressId ? colors.primary : colors.textSecondary} />
        </View>
        <View>
          <Text style={styles.addressTitle}>{item.title}</Text>
          <Text style={styles.addressDetail}>{item.street}</Text>
        </View>
      </View>
      {item.id === selectedAddressId ? (
        <CheckCircle2 size={20} color={colors.primary} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.header}>
      <View style={styles.leftContent}>
        <View style={styles.greetingContainer}>
          <Text style={styles.helloText}>Hola,</Text>
          <Text style={styles.nameText}>{userFirstName} 👋</Text>
        </View>
        <TouchableOpacity 
          style={styles.locationSelector} 
          activeOpacity={0.7}
          onPress={() => setIsAddressModalVisible(true)}
        >
          <Text 
            style={styles.locationText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {addressLabel}
          </Text>
          <ChevronDown size={14} color={colors.primary} style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.rightContent}>
        <IconButton 
          icon={<Bell size={22} color={colors.text} fill={colors.text} />} 
          variant="glass"
          size={40}
          style={styles.notificationButton}
        />
        
        {/* Cart Button with Badge */}
        <TouchableOpacity 
          onPress={() => setIsCartDrawerVisible(true)}
          style={styles.cartButton}
        >
          <ShoppingBag size={22} color={colors.text} />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Avatar 
          source={profile.avatar} 
          initials={getInitials()} 
          size={44}
          style={styles.avatar}
        />
      </View>

      {/* Cart Drawer */}
      <CartDrawer 
        visible={isCartDrawerVisible}
        onClose={() => setIsCartDrawerVisible(false)}
        onViewFullCart={() => {
          setIsCartDrawerVisible(false);
          onViewCart?.();
        }}
      />

      {/* Address Picker Modal */}
      <Modal
        visible={isAddressModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>¿Dónde entregamos hoy?</Text>
              <TouchableOpacity onPress={() => setIsAddressModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={renderAddressItem}
              contentContainerStyle={styles.addressList}
            />

            <TouchableOpacity style={styles.manageAddressesButton}>
              <Text style={styles.manageAddressesText}>Gestionar direcciones</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  leftContent: {
    justifyContent: 'center',
    flex: 1,
    marginRight: 12,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helloText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  nameText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: colors.primary,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.text,
    flexShrink: 1,
  },
  chevronIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  cartBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: colors.white,
  },
  avatar: {
    backgroundColor: '#E5E5EA',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.text,
  },
  addressList: {
    paddingBottom: 20,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  activeAddressItem: {
    backgroundColor: colors.primary + '05',
    borderColor: colors.primary + '20',
  },
  addressItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activeIconWrapper: {
    backgroundColor: colors.primary + '15',
  },
  addressTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  addressDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  manageAddressesButton: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  manageAddressesText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.primary,
  },
});
