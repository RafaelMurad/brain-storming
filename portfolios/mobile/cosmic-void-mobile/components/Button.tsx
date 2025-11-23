import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.cosmic.cyan, colors.cosmic.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.secondaryButton, style]} activeOpacity={0.8}>
      <Text style={styles.secondaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.cosmic.purple,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.cosmic.purple,
    fontSize: 16,
    fontWeight: '600',
  },
});
