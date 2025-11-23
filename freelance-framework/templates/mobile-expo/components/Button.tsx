import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<string, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-card border border-border',
    text: 'text-white',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-primary-500',
  },
  danger: {
    container: 'bg-red-500',
    text: 'text-white',
  },
};

const sizeStyles: Record<string, { container: string; text: string }> = {
  sm: {
    container: 'py-2 px-4',
    text: 'text-sm',
  },
  md: {
    container: 'py-3 px-6',
    text: 'text-base',
  },
  lg: {
    container: 'py-4 px-8',
    text: 'text-lg',
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={animatedStyle}
      className={`
        rounded-xl items-center justify-center flex-row
        ${variantStyle.container}
        ${sizeStyle.container}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? '#0ea5e9' : 'white'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={`font-semibold ${variantStyle.text} ${sizeStyle.text}`}>
        {title}
      </Text>
    </AnimatedPressable>
  );
}
