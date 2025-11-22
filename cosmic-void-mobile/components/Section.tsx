import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Section({ title, subtitle, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <View style={styles.divider} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: colors.cosmic.cyan,
    borderRadius: 2,
  },
});
