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
        <ActivityIndicator color={variant === 'outline' ? theme.colors.text : theme.colors.background} />
      ) : (
        <Text style={[textStyle, disabled && styles.textDisabled]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...theme.elevation.low,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  textPrimary: {
    color: theme.colors.background,
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
  },
  textOutline: {
    color: theme.colors.text,
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
  },
  textDisabled: {
    color: theme.colors.textTertiary,
  },
});
