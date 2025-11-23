import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
}

export default function StarField() {
  const stars = useRef<Star[]>([]);

  useEffect(() => {
    // Generate stars
    stars.current = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      opacity: new Animated.Value(Math.random()),
    }));

    // Animate stars
    stars.current.forEach((star) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      animate();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.current.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
});
