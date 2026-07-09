import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ACTIVE_COLOR = '#0284c7';
const INACTIVE_COLOR = '#94a3b8';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'home'
              ? 'home'
              : route.name === 'live-queue'
                ? 'people'
                : route.name === 'medical-records'
                  ? 'document-text'
                  : 'person-circle';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Trang chủ' }}
      />
      <Tabs.Screen
        name="live-queue"
        options={{ title: 'Phòng chờ' }}
      />
      <Tabs.Screen
        name="medical-records"
        options={{ title: 'Bệnh án' }}
      />
      <Tabs.Screen
        name="patients"
        options={{ title: 'Bệnh nhân' }}
      />
      <Tabs.Screen
        name="appointments"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="two"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
    </Tabs>
  );
}
