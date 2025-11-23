import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/theme';

interface MinimalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  style?: ViewStyle;
}

export default function MinimalButton({
  title,
  onPress,
  variant = 'primary',
  style
}: MinimalButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.primaryButton, style]}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.secondaryButton, style]}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.textButton, style]}
      activeOpacity={0.6}
    >
      <Text style={styles.textButtonText}>{title} →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.nordic.night,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 2,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.nordic.snow,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.nordic.night,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.nordic.night,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  textButton: {
    paddingVertical: 8,
  },
  textButtonText: {
    color: colors.nordic.charcoal,
    fontSize: 14,
    fontWeight: '500',
  },
});
