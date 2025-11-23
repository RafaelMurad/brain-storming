import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail, MapPin, Link as LinkIcon } from 'lucide-react-native';
import { useAppStore } from '@/store/appStore';

export default function ProfileScreen() {
  const { user } = useAppStore();

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
          className="items-center pt-8 pb-6"
        >
          <View className="w-24 h-24 rounded-full bg-primary-500/20 items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-2xl font-bold">
            {user?.name || 'Guest User'}
          </Text>
          <Text className="text-muted text-base mt-1">
            {user?.email || 'Not signed in'}
          </Text>
        </Animated.View>

        {/* Info Cards */}
        <View className="px-6 space-y-4">
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <Text className="text-primary-400 text-xs font-medium uppercase tracking-wider mb-4">
              Contact Info
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center mr-3">
                  <Mail size={18} color="#0ea5e9" />
                </View>
                <View>
                  <Text className="text-muted text-xs">Email</Text>
                  <Text className="text-white text-sm">hello@example.com</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center mr-3">
                  <MapPin size={18} color="#0ea5e9" />
                </View>
                <View>
                  <Text className="text-muted text-xs">Location</Text>
                  <Text className="text-white text-sm">San Francisco, CA</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center mr-3">
                  <LinkIcon size={18} color="#0ea5e9" />
                </View>
                <View>
                  <Text className="text-muted text-xs">Website</Text>
                  <Text className="text-white text-sm">example.com</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <Text className="text-primary-400 text-xs font-medium uppercase tracking-wider mb-4">
              Stats
            </Text>

            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">42</Text>
                <Text className="text-muted text-sm">Projects</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">128</Text>
                <Text className="text-muted text-sm">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">56</Text>
                <Text className="text-muted text-sm">Following</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
