import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../utils/theme';

export const Button = ({ title, onPress, variant = 'primary', disabled = false, loading = false, style }) => {
  const buttonStyle = variant === 'outline' ? styles.buttonOutline : styles.buttonPrimary;
  const textStyle = variant === 'outline' ? styles.textOutline : styles.textPrimary;

  return (
    <TouchableOpacity
      style={[buttonStyle, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.text : theme.colors.surface} />
      ) : (
        <Text style={[textStyle, disabled && styles.textDisabled]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonOutline: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  textPrimary: {
    color: theme.colors.surface,
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    textTransform: 'uppercase',
  },
  textOutline: {
    color: theme.colors.text,
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    textTransform: 'uppercase',
  },
  textDisabled: {
    color: theme.colors.textTertiary,
  },
});
