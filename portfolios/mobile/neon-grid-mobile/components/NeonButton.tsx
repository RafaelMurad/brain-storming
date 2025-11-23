import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export default function NeonButton({
  title,
  onPress,
  variant = 'primary',
  style
}: NeonButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.neon.magenta, colors.neon.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.neon.cyan, colors.neon.blue]}
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
    <TouchableOpacity
      onPress={onPress}
      style={[styles.outlineButton, style]}
      activeOpacity={0.8}
    >
      <Text style={styles.outlineText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  outlineButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.neon.cyan,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: colors.neon.cyan,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
