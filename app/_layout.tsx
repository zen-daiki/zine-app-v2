import { Drawer } from 'expo-router/drawer';
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type DrawerParamList = {
  '(tabs)': undefined;
  'faq': undefined;
  'contact': undefined;
  'privacy': undefined;
  'terms': undefined;
};

type NavigationType = DrawerNavigationProp<DrawerParamList>;

export default function RootLayout() {
  const navigation = useNavigation<NavigationType>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'ZIEN',
          headerTitleAlign: 'center',
          headerShown: true,
          drawerPosition: 'left',
          drawerType: 'front',
          drawerStyle: {
            width: '70%',
            backgroundColor: '#fff',
          },
          drawerActiveBackgroundColor: '#f0f0f0',
          drawerActiveTintColor: '#333',
          drawerInactiveTintColor: '#666',
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'ホーム',
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginLeft: 16, padding: 8 }}
              >
                <Ionicons name="menu" size={24} color="#333" />
              </Pressable>
            ),
          }}
        />
        <Drawer.Screen
          name="faq"
          options={{
            drawerLabel: 'よくある質問',
            title: 'よくある質問',
          }}
        />
        <Drawer.Screen
          name="contact"
          options={{
            drawerLabel: 'お問い合わせ',
            title: 'お問い合わせ',
          }}
        />
        <Drawer.Screen
          name="privacy"
          options={{
            drawerLabel: 'プライバシーポリシー',
            title: 'プライバシーポリシー',
          }}
        />
        <Drawer.Screen
          name="terms"
          options={{
            drawerLabel: '利用規約',
            title: '利用規約',
          }}
        />
        <Drawer.Screen
          name="+not-found"
          options={{
            drawerItemStyle: { display: 'none' }
          }}
        />
      </Drawer>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
