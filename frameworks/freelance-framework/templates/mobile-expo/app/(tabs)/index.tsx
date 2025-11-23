import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react-native';

const features = [
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'Crafted with attention to detail',
    color: '#0ea5e9',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Built with security in mind',
    color: '#10b981',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-6 pt-8 pb-12"
        >
          <Text className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">
            Welcome
          </Text>
          <Text className="text-white text-4xl font-bold mb-4">
            Build something{'\n'}
            <Text className="text-primary-500">amazing today</Text>
          </Text>
          <Text className="text-muted text-lg leading-relaxed">
            A modern React Native template with everything you need to build beautiful apps.
          </Text>
        </Animated.View>

        {/* Features */}
        <View className="px-6 space-y-4">
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(200 + index * 100).springify()}
              className="bg-card rounded-2xl p-5 border border-border"
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon size={24} color={feature.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold">
                    {feature.title}
                  </Text>
                  <Text className="text-muted text-sm">{feature.description}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* CTA Button */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="px-6 mt-8"
        >
          <Pressable
            onPress={() => router.push('/profile')}
            className="bg-primary-500 rounded-xl py-4 flex-row items-center justify-center active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg mr-2">
              Get Started
            </Text>
            <ArrowRight size={20} color="white" />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
