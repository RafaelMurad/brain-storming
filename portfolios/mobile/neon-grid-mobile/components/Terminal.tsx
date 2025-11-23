import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface TerminalProps {
  lines: string[];
}

export default function Terminal({ lines }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setVisibleLines((prev) => [...prev, lines[index]]);
        index++;
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lines]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#ff5f56' }]} />
          <View style={[styles.dot, { backgroundColor: '#ffbd2e' }]} />
          <View style={[styles.dot, { backgroundColor: '#27ca3f' }]} />
        </View>
        <Text style={styles.title}>terminal</Text>
      </View>
      <View style={styles.body}>
        {visibleLines.map((line, index) => (
          <Text key={index} style={styles.line}>
            <Text style={styles.prompt}>{'> '}</Text>
            {line}
          </Text>
        ))}
        <Text style={styles.cursorLine}>
          <Text style={styles.prompt}>{'> '}</Text>
          <Text style={[styles.cursor, { opacity: cursor ? 1 : 0 }]}>_</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neon.black,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neon.purple + '40',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.neon.dark,
    borderBottomWidth: 1,
    borderBottomColor: colors.neon.purple + '40',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 12,
    color: colors.text.muted,
    fontFamily: 'monospace',
  },
  body: {
    padding: 16,
  },
  line: {
    fontSize: 13,
    color: colors.neon.green,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  prompt: {
    color: colors.neon.magenta,
  },
  cursorLine: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  cursor: {
    color: colors.neon.cyan,
  },
});
