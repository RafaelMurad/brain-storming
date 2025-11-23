import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Bell,
  Moon,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useAppStore } from '@/store/appStore';
import { useState } from 'react';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: SettingItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 active:opacity-70"
    >
      <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center mr-3">
        <Icon size={20} color="#0ea5e9" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-base font-medium">{title}</Text>
        {subtitle && <Text className="text-muted text-sm">{subtitle}</Text>}
      </View>
      {rightElement || <ChevronRight size={20} color="#94a3b8" />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { theme, setTheme, reset } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const isDarkMode = theme === 'dark';

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
          className="px-6 pt-8 pb-6"
        >
          <Text className="text-white text-3xl font-bold">Settings</Text>
          <Text className="text-muted text-base mt-1">
            Manage your preferences
          </Text>
        </Animated.View>

        {/* Settings Groups */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-6"
        >
          <View className="bg-card rounded-2xl border border-border px-4">
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Push notifications"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#334155', true: '#0ea5e9' }}
                  thumbColor="white"
                />
              }
            />
            <View className="h-px bg-border" />
            <SettingItem
              icon={Moon}
              title="Dark Mode"
              subtitle="Use dark theme"
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
                  trackColor={{ false: '#334155', true: '#0ea5e9' }}
                  thumbColor="white"
                />
              }
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="px-6 mt-6"
        >
          <View className="bg-card rounded-2xl border border-border px-4">
            <SettingItem
              icon={Lock}
              title="Privacy"
              subtitle="Manage your data"
              onPress={() => {}}
            />
            <View className="h-px bg-border" />
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="px-6 mt-6"
        >
          <Pressable
            onPress={() => reset()}
            className="bg-red-500/10 rounded-2xl py-4 flex-row items-center justify-center active:opacity-70"
          >
            <LogOut size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold text-base ml-2">
              Sign Out
            </Text>
          </Pressable>
        </Animated.View>

        {/* Version */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="items-center mt-8"
        >
          <Text className="text-muted text-sm">Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
