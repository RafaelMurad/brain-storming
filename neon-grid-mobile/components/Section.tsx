import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface SectionProps {
  title: string;
  code?: string;
  children: React.ReactNode;
}

export default function Section({ title, code, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.indicator} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {code && <Text style={styles.code}>{code}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,0,255,0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    backgroundColor: colors.neon.magenta,
    borderRadius: 2,
    shadowColor: colors.neon.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  code: {
    fontSize: 12,
    color: colors.neon.cyan,
    fontFamily: 'monospace',
  },
  content: {},
});
