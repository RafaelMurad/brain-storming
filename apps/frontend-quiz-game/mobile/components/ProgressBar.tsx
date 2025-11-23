import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: 'primary' | 'success' | 'error' | 'warning';
}

export default function ProgressBar({ progress, height = 8, color = 'primary' }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress * 100, { duration: 500 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const gradientColors = {
    primary: [colors.quiz.primary, colors.quiz.secondary] as [string, string],
    success: [colors.quiz.success, '#16a34a'] as [string, string],
    error: [colors.quiz.error, '#dc2626'] as [string, string],
    warning: [colors.quiz.accent, '#d97706'] as [string, string],
  };

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={[styles.fill, animatedStyle]}>
        <LinearGradient
          colors={gradientColors[color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.quiz.dark,
    borderRadius: 100,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
});
