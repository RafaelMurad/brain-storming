import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[{ opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={[colors.quiz.primary, colors.quiz.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButton}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const buttonStyles = {
    secondary: styles.secondaryButton,
    success: [styles.solidButton, { backgroundColor: colors.quiz.success }],
    error: [styles.solidButton, { backgroundColor: colors.quiz.error }],
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        buttonStyles[variant],
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.quiz.card,
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  solidButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
