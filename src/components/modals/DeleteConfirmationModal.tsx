import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  methodName: string;
}

export const DeleteConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm,
  methodName
}: DeleteConfirmationModalProps) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] }
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconBg}>
              <AlertTriangle size={32} color="#EF4444" strokeWidth={2.5} />
            </View>
          </View>

          <Text style={styles.title}>¿Eliminar método?</Text>
          <Text style={styles.message}>
            ¿Estás seguro de que deseas eliminar <Text style={styles.boldText}>{methodName}</Text>? Esta acción no se puede deshacer.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>ELIMINAR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slightly bluer tint for premium look
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    maxWidth: width * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  boldText: {
    fontFamily: 'Inter_700Bold',
    color: '#334155',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  deleteButtonText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 18,
    borderRadius: 20,
    width: '100%',
  },
  cancelButtonText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
