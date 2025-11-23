import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { login, isLoading, error, clearError } = useGameStore();

  const handleLogin = async () => {
    clearError();
    if (!username.trim() || !email.trim()) return;

    const success = await login(username.trim(), email.trim());
    if (success) {
      router.replace('/play');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View entering={FadeIn} style={styles.logoSection}>
            <LinearGradient
              colors={[colors.quiz.primary, colors.quiz.secondary]}
              style={styles.logoGradient}
            >
              <Text style={styles.logoIcon}>🎯</Text>
            </LinearGradient>
            <Text style={styles.title}>Frontend Quiz</Text>
            <Text style={styles.subtitle}>Enter your details to start playing</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.text.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Start Playing"
              onPress={handleLogin}
              disabled={!username.trim() || !email.trim()}
              loading={isLoading}
              style={styles.submitButton}
            />

            <Text style={styles.note}>
              Your progress will be saved automatically
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.quiz.darker,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quiz.dark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.quiz.border,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  errorContainer: {
    backgroundColor: colors.quiz.error + '20',
    borderWidth: 1,
    borderColor: colors.quiz.error + '40',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: colors.quiz.error,
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
  },
  note: {
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
