import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
  // 2. ÉP TẢI TRƯỚC FONT ICON Ở ĐÂY
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome5.font,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  const segments = useSegments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    async function checkToken() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        setUserToken(token);
      } catch (e) {
        console.log('Không lấy được token');
      } finally {
        setIsLoading(false);
      }
    }
    checkToken();
  }, []);

  useEffect(() => {
    // Chỉ điều hướng khi CẢ token lẫn FONT chữ đã được load xong hoàn toàn
    if (isLoading || !fontsLoaded) return;

    async function guardRoute() {
      const token = await SecureStore.getItemAsync('userToken');
      const inAuthGroup = segments[0] === '(tabs)';

      if (!token && inAuthGroup) {
        router.replace('/login' as any);
      } else if (token && !inAuthGroup) {
        router.replace('/' as any);
      }
    }

    guardRoute();
  }, [userToken, isLoading, segments, fontsLoaded]); // Thêm fontsLoaded vào dependency

  // 3. NẾU FONT CHƯA TẢI XONG THÌ GIỮ MÀN HÌNH CHỜ (Tránh crash màn hình Home)
  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
