import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.quiz.darker }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.quiz.darker },
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}
