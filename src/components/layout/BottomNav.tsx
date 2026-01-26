import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Home, Tag, FileText, User } from 'lucide-react-native';
import { colors } from '../../theme';

export type TabType = 'HOME' | 'OFERTAS' | 'PEDIDOS' | 'CUENTA';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const NavItem = ({ 
    tab, 
    label, 
    icon: Icon 
  }: { 
    tab: TabType, 
    label: string, 
    icon: any 
  }) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onTabChange(tab)}
      >
        <View style={styles.iconContainer}>
          <Icon 
            size={24} 
            color={isActive ? colors.primary : colors.textSecondary} 
          />
        </View>
        <Text style={[
          styles.navText, 
          { color: isActive ? colors.primary : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomNav}>
      <NavItem tab="HOME" label="Inicio" icon={Home} />
      <NavItem tab="OFERTAS" label="Ofertas" icon={Tag} />
      <NavItem tab="PEDIDOS" label="Pedidos" icon={FileText} />
      <NavItem tab="CUENTA" label="Cuenta" icon={User} />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 60,
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 5,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 4,
  },
  navText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
