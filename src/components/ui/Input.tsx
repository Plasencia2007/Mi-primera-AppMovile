import React, { useState, forwardRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TextInputProps, 
  TouchableOpacity,
  ViewStyle,
  StyleProp
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(({ 
  label, 
  error, 
  icon, 
  isPassword, 
  containerStyle,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Explicit boolean casting for native props
  const isSecure = isPassword && !showPassword ? true : false;
  const hasLabel = label ? true : false;
  const hasError = error ? true : false;
  const hasIcon = icon ? true : false;

  return (
    <View style={[styles.container, containerStyle]}>
      {hasLabel ? <Text style={styles.label}>{label}</Text> : null}
      
      <View style={[
        styles.inputWrapper,
        isFocused ? styles.focusedWrapper : null,
        hasError ? styles.errorWrapper : null
      ]}>
        {hasIcon ? <View style={styles.iconContainer}>{icon}</View> : null}
        
        <TextInput
          ref={ref}
          {...props}
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          secureTextEntry={isSecure}
        />

        {isPassword ? (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#F1F3F5',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  focusedWrapper: {
    borderColor: colors.primary,
  },
  errorWrapper: {
    borderColor: '#FF4D4D',
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.text,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#FF4D4D',
    marginTop: 4,
    marginLeft: 4,
  },
});
