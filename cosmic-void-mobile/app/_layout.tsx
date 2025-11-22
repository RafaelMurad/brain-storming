import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmic.void }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cosmic.void },
          animation: 'fade',
        }}
      />
    </View>
  );
}
