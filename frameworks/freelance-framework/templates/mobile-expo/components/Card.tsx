import { View, ViewProps } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  animated?: boolean;
  delay?: number;
}

export function Card({
  children,
  animated = false,
  delay = 0,
  className = '',
  ...props
}: CardProps) {
  const baseClassName = `bg-card rounded-2xl p-5 border border-border ${className}`;

  if (animated) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).springify()}
        className={baseClassName}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View className={baseClassName} {...props}>
      {children}
    </View>
  );
}
