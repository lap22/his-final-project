import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0284c7' }}>
      <Tabs.Screen
        name="index" // Đây chính là file trang chủ index.tsx của bạn
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      {/* Bạn có thể thêm các tab khác như ai-chat, appointments ở đây sau */}
    </Tabs>
  );
}
