import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/constants/theme';

interface GlitchTextProps {
  text: string;
  style?: TextStyle;
}

export default function GlitchText({ text, style }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 100);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]}>{text}</Text>
      {glitching && (
        <>
          <Text style={[styles.text, styles.glitchCyan, style]}>{text}</Text>
          <Text style={[styles.text, styles.glitchMagenta, style]}>{text}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  text: {
    color: '#fff',
    fontWeight: '800',
  },
  glitchCyan: {
    position: 'absolute',
    left: 2,
    top: 0,
    color: colors.neon.cyan,
    opacity: 0.7,
  },
  glitchMagenta: {
    position: 'absolute',
    left: -2,
    top: 0,
    color: colors.neon.magenta,
    opacity: 0.7,
  },
});
