import { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

type TabScreen = {
  name: string;
  title: string;
  focusedIcon: ComponentProps<typeof Ionicons>['name'];
  unfocusedIcon: ComponentProps<typeof Ionicons>['name'];
};

export default function TabLayout() {
  const tabScreens: TabScreen[] = [
    {
      name: "book",
      title: "ホーム",
      focusedIcon: "home-sharp",
      unfocusedIcon: "home-outline"
    },
    {
      name: "news",
      title: "お知らせ",
      focusedIcon: "newspaper",
      unfocusedIcon: "newspaper-outline"
    },
    {
      name: "editing",
      title: "編集中データ",
      focusedIcon: "book",
      unfocusedIcon: "book-outline"
    },
    {
      name: "order",
      title: "注文履歴",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline"
    }
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? screen.focusedIcon : screen.unfocusedIcon}
                color={color}
                size={24}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
