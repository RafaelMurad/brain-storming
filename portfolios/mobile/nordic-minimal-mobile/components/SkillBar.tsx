import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface SkillBarProps {
  name: string;
  level: number;
  index?: number;
}

export default function SkillBar({ name, level, index = 0 }: SkillBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(index * 150, withTiming(level, { duration: 800 }));
  }, [level, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.level}>{level}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.progress, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.primary,
  },
  level: {
    fontSize: 12,
    color: colors.text.muted,
  },
  track: {
    height: 2,
    backgroundColor: colors.nordic.stone,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.nordic.night,
    borderRadius: 1,
  },
});
