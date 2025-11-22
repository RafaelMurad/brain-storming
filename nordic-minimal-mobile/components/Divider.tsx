import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface DividerProps {
  withSymbol?: boolean;
}

export default function Divider({ withSymbol }: DividerProps) {
  if (withSymbol) {
    return (
      <View style={styles.symbolContainer}>
        <View style={styles.line} />
        <View style={styles.symbol} />
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={styles.simple} />;
}

const styles = StyleSheet.create({
  simple: {
    height: 1,
    backgroundColor: colors.nordic.stone,
    marginHorizontal: 24,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.nordic.stone,
  },
  symbol: {
    width: 6,
    height: 6,
    backgroundColor: colors.nordic.charcoal,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 16,
  },
});
