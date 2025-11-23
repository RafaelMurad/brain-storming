import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  centered?: boolean;
}

export default function Section({ title, subtitle, children, centered }: SectionProps) {
  return (
    <View style={styles.container}>
      {(title || subtitle) && (
        <View style={[styles.header, centered && styles.centered]}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 32,
  },
  centered: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  content: {},
});
