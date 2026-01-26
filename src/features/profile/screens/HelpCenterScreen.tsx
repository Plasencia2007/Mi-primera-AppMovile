import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  TextInput
} from 'react-native';
import { 
  ChevronLeft, 
  Search,
  Package,
  CreditCard,
  Smartphone,
  Clock,
  Wallet,
  XCircle,
  ShieldCheck,
  ChevronRight,
  MessageCircle
} from 'lucide-react-native';
import { colors } from '../../../theme';

const { width } = Dimensions.get('window');

interface HelpCenterScreenProps {
  onBack: () => void;
}

export const HelpCenterScreen = ({ onBack }: HelpCenterScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const QuickActionCard = ({ icon: Icon, title, onPress }: any) => (
    <TouchableOpacity 
      style={styles.quickActionCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.quickActionIcon}>
        <Icon size={24} color={colors.primary} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const FAQItem = ({ icon: Icon, title, onPress }: any) => (
    <TouchableOpacity 
      style={styles.faqItem}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.faqLeft}>
        <View style={styles.faqIconBox}>
          <Icon size={20} color={colors.primary} />
        </View>
        <Text style={styles.faqTitle} numberOfLines={1}>{title}</Text>
      </View>
      <ChevronRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#181111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CENTRO DE AYUDA</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="¿Cómo podemos ayudarte?"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <QuickActionCard 
            icon={Package}
            title="Mi Pedido Actual"
            onPress={() => {}}
          />
          <QuickActionCard 
            icon={CreditCard}
            title="Pagos y Facturas"
            onPress={() => {}}
          />
          <QuickActionCard 
            icon={Smartphone}
            title="Problemas con la App"
            onPress={() => {}}
          />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        </View>

        {/* FAQ List */}
        <View style={styles.faqList}>
          <FAQItem 
            icon={Clock}
            title="Tiempos de entrega"
            onPress={() => {}}
          />
          <FAQItem 
            icon={Wallet}
            title="Métodos de pago aceptados"
            onPress={() => {}}
          />
          <FAQItem 
            icon={XCircle}
            title="Política de cancelación"
            onPress={() => {}}
          />
          <FAQItem 
            icon={ShieldCheck}
            title="Garantía de calidad"
            onPress={() => {}}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.chatButton}
          activeOpacity={0.9}
        >
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.chatButtonText}>CHATEAR CON SOPORTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#181111',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#181111',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(236, 19, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#181111',
    textAlign: 'center',
    lineHeight: 14,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#181111',
    letterSpacing: -0.5,
  },
  faqList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  faqLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  faqIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 19, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#181111',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  chatButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  }
});
