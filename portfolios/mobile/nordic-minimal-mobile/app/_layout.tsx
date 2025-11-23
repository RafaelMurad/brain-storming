import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.nordic.snow }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.nordic.snow },
          animation: 'fade',
        }}
      />
    </View>
  );
}
