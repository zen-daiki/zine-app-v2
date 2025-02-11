import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";

type DrawerParamList = {
  "(tabs)": undefined;
  "(menu)/faq": undefined;
  "(menu)/contact": undefined;
  "(menu)/terms": undefined;
  "(menu)/check-storage": undefined;
};

type NavigationType = DrawerNavigationProp<DrawerParamList>;

export default function RootLayout() {
  const navigation = useNavigation<NavigationType>();

  const menuScreens = [
    {
      name: "(menu)/faq",
      label: "よくある質問",
      title: "よくある質問"
    },
    {
      name: "(menu)/contact",
      label: "お問い合わせ",
      title: "お問い合わせ"
    },
    {
      name: "(menu)/terms",
      label: "利用規約",
      title: "利用規約"
    },
    {
      name: "(menu)/check-storage",
      label: "【確認】Storage",
      title: "【確認】Storage"
    }
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Drawer
        screenOptions={{
          headerTintColor: "#333",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "ZINE",
          headerTitleAlign: "center",
          headerShown: true,
          drawerPosition: "right",
          drawerType: "front",
          drawerStyle: {
            width: "70%",
            backgroundColor: "#fff",
          },
          drawerActiveBackgroundColor: "#f0f0f0",
          drawerActiveTintColor: "#333",
          drawerInactiveTintColor: "#666",
          drawerItemStyle: { display: "none" },
          headerLeft: () => null,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 16, padding: 8 }}
            >
              <Ionicons name="menu" size={24} color="#333" />
            </Pressable>
          ),
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "ホーム",
            title: "ホーム",
            drawerItemStyle: { display: "flex" },
          }}
        />
        {menuScreens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            options={{
              drawerLabel: screen.label,
              title: screen.title,
              drawerItemStyle: { display: "flex" },
              headerLeft: () => (
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ marginLeft: 16, padding: 8 }}
                >
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
              )
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
