import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
}

export default function StatCard({ icon, value, label, color = colors.quiz.primary }: StatCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.quiz.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 4,
  },
});
