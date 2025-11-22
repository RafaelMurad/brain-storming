import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function GridBackground() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const horizontalLines = Array.from({ length: 20 }, (_, i) => i);
  const verticalLines = Array.from({ length: 10 }, (_, i) => i);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Horizontal grid lines */}
      {horizontalLines.map((i) => (
        <Animated.View
          key={`h-${i}`}
          style={[
            styles.horizontalLine,
            {
              top: i * (height / 20),
              opacity: pulseAnim,
            },
          ]}
        />
      ))}
      {/* Vertical grid lines */}
      {verticalLines.map((i) => (
        <Animated.View
          key={`v-${i}`}
          style={[
            styles.verticalLine,
            {
              left: i * (width / 10),
              opacity: pulseAnim,
            },
          ]}
        />
      ))}
      {/* Corner glow effect */}
      <View style={styles.cornerGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neon.cyan,
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.neon.magenta,
  },
  cornerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    backgroundColor: colors.neon.purple,
    opacity: 0.1,
    borderRadius: 200,
  },
});
