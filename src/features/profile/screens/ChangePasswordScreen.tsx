import React, { useState } from 'react';
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
import { 
  ChevronLeft, 
  Lock, 
  Eye, 
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Circle
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme';

const { width } = Dimensions.get('window');

interface ChangePasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ChangePasswordScreen = ({ onBack, onSuccess }: ChangePasswordScreenProps) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const requirements = [
    { text: 'Mínimo 8 caracteres', met: passwords.new.length >= 8 },
    { text: 'Al menos una mayúscula', met: /[A-Z]/.test(passwords.new) },
    { text: 'Un número o símbolo', met: /[0-9!@#$%^&*]/.test(passwords.new) },
  ];

  const handleUpdate = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden.');
      return;
    }
    if (requirements.some(r => !r.met)) {
      Alert.alert('Requisitos no cumplidos', 'Tu nueva contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }

    Alert.alert(
      '¡Éxito!', 
      'Tu contraseña ha sido actualizada correctamente.',
      [{ text: 'Aceptar', onPress: onSuccess }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CAMBIAR CONTRASEÑA</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoSection}>
            <View style={styles.shieldIconBox}>
              <ShieldCheck size={32} color={colors.primary} />
            </View>
            <Text style={styles.infoTitle}>Protege tu cuenta</Text>
            <Text style={styles.infoSubtitle}>
              Crea una contraseña fuerte que no uses en otros sitios para mayor seguridad.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Password Field Utility */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña actual</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#94A3B8" />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showCurrent}
                  value={passwords.current}
                  onChangeText={(text) => setPasswords({...passwords, current: text})}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#94A3B8" />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showNew}
                  value={passwords.new}
                  onChangeText={(text) => setPasswords({...passwords, new: text})}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Requirements Visualizer */}
            <View style={styles.requirementsContainer}>
              {requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  {req.met ? (
                    <CheckCircle2 size={14} color="#10B981" />
                  ) : (
                    <Circle size={14} color="#CBD5E1" />
                  )}
                  <Text style={[styles.requirementText, req.met && styles.requirementMetText]}>
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#94A3B8" />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirm}
                  value={passwords.confirm}
                  onChangeText={(text) => setPasswords({...passwords, confirm: text})}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.updateButton} 
            activeOpacity={0.9}
            onPress={handleUpdate}
          >
            <Text style={styles.updateButtonText}>ACTUALIZAR CONTRASEÑA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpButton} activeOpacity={0.6}>
            <Text style={styles.helpButtonText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#181111',
    letterSpacing: -0.2,
  },
  scrollContent: {
    padding: 24,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  shieldIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 19, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: '#181111',
    marginBottom: 8,
  },
  infoSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: '#334155',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#181111',
    marginLeft: 12,
  },
  requirementsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#94A3B8',
  },
  requirementMetText: {
    color: '#10B981',
  },
  updateButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  updateButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  helpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  helpButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.primary,
  }
});
