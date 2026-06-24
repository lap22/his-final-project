// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập (mặc định là false)
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra xem người dùng đang ở nhóm màn hình nào
    const inTabsGroup = segments[0] === '(tabs)';

    // Nếu CHƯA đăng nhập và cố tình vào trang chính (tabs), ép quay về login
    if (!isLoggedIn && inTabsGroup) {
      router.replace('/login');
    }
    // Nếu ĐÃ đăng nhập mà vẫn ở trang login/register, đẩy vào trang chính
    else if (isLoggedIn && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Khai báo các màn hình trong ứng dụng */}
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}