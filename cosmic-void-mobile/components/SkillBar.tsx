import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface SkillBarProps {
  name: string;
  level: number;
  icon: string;
}

export default function SkillBar({ name, level, icon }: SkillBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: level,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [level]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.level}>{level}%</Text>
      </View>

      <View style={styles.barContainer}>
        <Animated.View style={[styles.barFill, { width }]}>
          <LinearGradient
            colors={[colors.cosmic.cyan, colors.cosmic.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cosmic.dark + 'cc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
    color: colors.cosmic.cyan,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  level: {
    color: colors.cosmic.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.cosmic.cyan + '20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
