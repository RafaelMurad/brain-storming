import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface SkillBarProps {
  name: string;
  level: number;
  category: string;
  index?: number;
}

export default function SkillBar({ name, level, category, index = 0 }: SkillBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(index * 100, withTiming(level, { duration: 1000 }));
  }, [level, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.category}>[{category}]</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.level}>{level}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.progress, animatedStyle]}>
          <LinearGradient
            colors={[colors.neon.magenta, colors.neon.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        {/* Grid segments */}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={i} style={[styles.segment, { left: `${i * 10}%` }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    fontSize: 10,
    color: colors.neon.magenta,
    fontFamily: 'monospace',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  level: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neon.cyan,
    fontFamily: 'monospace',
  },
  track: {
    height: 8,
    backgroundColor: colors.neon.dark,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.neon.purple + '40',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.neon.black,
  },
});
